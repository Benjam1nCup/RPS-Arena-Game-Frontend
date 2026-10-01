import type { GameOutcome, Move } from "@/types/game";

const BEATS: Record<Move, Move> = {
  rock: "scissors",
  scissors: "paper",
  paper: "rock",
};

export function resolveMoves(yourMove: Move, opponentMove: Move): GameOutcome {
  if (yourMove === opponentMove) return "draw";
  if (BEATS[yourMove] === opponentMove) return "win";
  return "lose";
}

export function pickRandomMove(): Move {
  const moves: Move[] = ["rock", "paper", "scissors"];
  return moves[Math.floor(Math.random() * moves.length)]!;
}
