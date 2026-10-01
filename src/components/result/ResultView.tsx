"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { MOVE_EMOJI, MOVE_LABEL } from "@/lib/constants";
import { formatRps } from "@/lib/utils";
import type { GameResult } from "@/types/game";
import Link from "next/link";

export function ResultView({
  result,
  stake,
  onPlayAgain,
}: {
  result: GameResult;
  stake: number;
  onPlayAgain: () => void;
}) {
  const title =
    result.outcome === "win"
      ? "You win"
      : result.outcome === "lose"
        ? "You lost"
        : "Draw";

  const payoutLabel =
    result.outcome === "win"
      ? `+${formatRps(result.breakdown.winnerPayout)} RPS`
      : result.outcome === "lose"
        ? `-${formatRps(stake)} RPS`
        : "Stake returned";

  return (
    <div className="mx-auto max-w-lg space-y-6 text-center animate-fade-in">
      <div>
        <h1
          className={`text-4xl font-black uppercase tracking-wide ${
            result.outcome === "win"
              ? "text-success"
              : result.outcome === "lose"
                ? "text-danger"
                : "text-text-primary"
          }`}
        >
          {title}
        </h1>
        <p className="mt-2 text-2xl font-bold">{payoutLabel}</p>
      </div>

      <div className="flex items-center justify-center gap-8">
        <div>
          <p className="text-4xl">{MOVE_EMOJI[result.yourMove]}</p>
          <p className="text-sm font-semibold">{MOVE_LABEL[result.yourMove]}</p>
        </div>
        <span className="text-text-muted">vs</span>
        <div>
          <p className="text-4xl">{MOVE_EMOJI[result.opponentMove]}</p>
          <p className="text-sm font-semibold">{MOVE_LABEL[result.opponentMove]}</p>
        </div>
      </div>

      <p className="text-text-secondary">{result.message}</p>

      {result.outcome === "win" ? (
        <Card className="text-left text-sm">
          <p className="mb-2 font-semibold uppercase tracking-wider text-text-muted">
            Prize breakdown
          </p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Your stake</span>
              <span>{formatRps(result.breakdown.yourStake)} RPS</span>
            </div>
            <div className="flex justify-between">
              <span>Opponent stake</span>
              <span>{formatRps(result.breakdown.opponentStake)} RPS</span>
            </div>
            <div className="flex justify-between">
              <span>Platform fee</span>
              <span>{formatRps(result.breakdown.platformFee)} RPS</span>
            </div>
            <div className="flex justify-between font-semibold text-success">
              <span>Your payout</span>
              <span>{formatRps(result.breakdown.winnerPayout)} RPS</span>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button fullWidth onClick={onPlayAgain}>
          Play again
        </Button>
        <Link href="/lobby" className="w-full">
          <Button variant="secondary" fullWidth>
            Return to lobby
          </Button>
        </Link>
      </div>
    </div>
  );
}
