import { pickRandomMove, resolveMoves } from "@/lib/gameLogic";
import { calcPrizeBreakdown, delay, randomBetween } from "@/lib/utils";
import type { GameSession } from "@/types/game";
import type { Room } from "@/types/room";
import type { GameService } from "./interfaces";
import { MOCK_OPPONENT_ADDRESS, MOCK_WALLET_ADDRESS } from "@/lib/constants";

const games = new Map<string, GameSession>();
let nextGameId = 9001;

function opponentFor(you: string, room: Room): string {
  const other = room.players.find((p) => p.address !== you);
  return other?.address ?? MOCK_OPPONENT_ADDRESS;
}

function createSession(room: Room, you: string): GameSession {
  const id = `game-${nextGameId++}`;
  const opp = opponentFor(you, room);
  const session: GameSession = {
    id,
    roomId: room.id,
    stake: room.stake,
    phase: "waiting_ready",
    round: 1,
    countdown: null,
    moveTimer: 10,
    you: {
      address: you,
      stake: room.stake,
      ready: false,
      moveLocked: false,
    },
    opponent: {
      address: opp,
      stake: room.stake,
      ready: false,
      moveLocked: false,
    },
    createdAt: Date.now(),
  };
  games.set(id, session);
  return session;
}

async function simulateOpponentReady(game: GameSession) {
  await delay(randomBetween(800, 2500));
  const g = games.get(game.id);
  if (g && g.phase === "waiting_ready") {
    g.opponent.ready = true;
  }
}

async function simulateOpponentMove(game: GameSession) {
  await delay(randomBetween(1200, 3500));
  const g = games.get(game.id);
  if (g && g.phase === "choosing_move" && !g.opponent.moveLocked) {
    g.opponent.move = pickRandomMove();
    g.opponent.moveLocked = true;
    if (g.you.moveLocked) {
      g.phase = "move_locked";
      void runReveal(g.id);
    }
  }
}

async function runReveal(gameId: string) {
  const g = games.get(gameId);
  if (!g) return;
  g.phase = "reveal";
  await delay(1000);
  const yourMove = g.you.move!;
  const opponentMove = g.opponent.move ?? pickRandomMove();
  g.opponent.move = opponentMove;
  const outcome = resolveMoves(yourMove, opponentMove);
  const breakdown = calcPrizeBreakdown(g.stake);
  let payoutRps = 0;
  let message = "";
  if (outcome === "win") {
    payoutRps = breakdown.winnerPayout;
    message = `${yourMove.toUpperCase()} beats ${opponentMove.toUpperCase()}`;
  } else if (outcome === "lose") {
    payoutRps = -g.stake;
    message = `${opponentMove.toUpperCase()} beats ${yourMove.toUpperCase()}`;
  } else {
    payoutRps = 0;
    message = `Both players chose ${yourMove.toUpperCase()}.`;
  }
  g.result = {
    outcome,
    yourMove,
    opponentMove,
    payoutRps,
    breakdown,
    message,
  };
  g.phase = "result";
}

export const mockGameService: GameService = {
  getGame(gameId) {
    const g = games.get(gameId);
    return g ? structuredClone(g) : null;
  },

  createFromRoom(room, you) {
    return createSession(room, you);
  },

  async markReady(gameId, address) {
    await delay(300);
    const g = games.get(gameId);
    if (!g) throw new Error("Game not found");
    if (address === g.you.address) g.you.ready = true;
    else g.opponent.ready = true;

    if (g.you.ready && !g.opponent.ready) {
      void simulateOpponentReady(g);
    }

    if (g.you.ready && g.opponent.ready) {
      g.phase = "countdown";
      g.countdown = 3;
    }
    return structuredClone(g);
  },

  async chooseMove(gameId, address, move) {
    await delay(400);
    const g = games.get(gameId);
    if (!g) throw new Error("Game not found");
    if (address !== g.you.address) throw new Error("Not your game");

    g.you.move = move;
    g.you.moveLocked = true;
    g.phase = "move_locked";

    if (!g.opponent.moveLocked) {
      void simulateOpponentMove(g);
    } else {
      void runReveal(g.id);
    }
    return structuredClone(g);
  },

  tick(gameId) {
    const g = games.get(gameId);
    if (!g) return null;

    if (g.phase === "countdown" && g.countdown !== null) {
      g.countdown -= 1;
      if (g.countdown <= 0) {
        g.phase = "choosing_move";
        g.countdown = null;
        g.moveTimer = 10;
      }
    } else if (g.phase === "choosing_move" && g.moveTimer > 0) {
      g.moveTimer -= 0.1;
      if (g.moveTimer <= 0) {
        g.moveTimer = 0;
        if (!g.you.moveLocked) {
          g.you.move = pickRandomMove();
          g.you.moveLocked = true;
        }
        if (!g.opponent.moveLocked) {
          g.opponent.move = pickRandomMove();
          g.opponent.moveLocked = true;
        }
        g.phase = "move_locked";
        void runReveal(g.id);
      }
    }
    return structuredClone(g);
  },
};

export function ensureDemoGame(): GameSession {
  const existing = games.get("demo");
  if (existing) return existing;
  const room: Room = {
    id: "demo-room",
    stake: 100,
    visibility: "public",
    hostAddress: MOCK_WALLET_ADDRESS,
    status: "in_game",
    players: [
      { address: MOCK_WALLET_ADDRESS, stake: 100, ready: true },
      { address: MOCK_OPPONENT_ADDRESS, stake: 100, ready: true },
    ],
  };
  const g = createSession(room, MOCK_WALLET_ADDRESS);
  g.id = "demo";
  games.delete(g.id);
  games.set("demo", g);
  return g;
}
