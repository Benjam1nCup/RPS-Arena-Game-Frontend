export type Move = "rock" | "paper" | "scissors";

export type GamePhase =
  | "waiting_ready"
  | "countdown"
  | "choosing_move"
  | "move_locked"
  | "reveal"
  | "result"
  | "closed";

export type GameOutcome = "win" | "lose" | "draw";

export interface GamePlayer {
  address: string;
  stake: number;
  move?: Move;
  moveLocked: boolean;
  ready: boolean;
}

export interface PrizeBreakdown {
  yourStake: number;
  opponentStake: number;
  platformFee: number;
  winnerPayout: number;
}

export interface GameResult {
  outcome: GameOutcome;
  yourMove: Move;
  opponentMove: Move;
  payoutRps: number;
  breakdown: PrizeBreakdown;
  message: string;
}

export interface GameSession {
  id: string;
  roomId: string;
  stake: number;
  phase: GamePhase;
  round: number;
  you: GamePlayer;
  opponent: GamePlayer;
  countdown: number | null;
  moveTimer: number;
  result?: GameResult;
  createdAt: number;
}

export type MatchmakingStatus =
  | "idle"
  | "searching"
  | "found"
  | "failed"
  | "cancelled";
