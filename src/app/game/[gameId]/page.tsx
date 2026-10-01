"use client";

import { CountdownDisplay } from "@/components/game/CountdownDisplay";
import { GameMoveButton } from "@/components/game/GameMoveButton";
import { PlayerCard } from "@/components/game/PlayerCard";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Modal } from "@/components/common/Modal";
import { MOVE_EMOJI, MOVE_LABEL } from "@/lib/constants";
import { formatRps } from "@/lib/utils";
import { useApp } from "@/context/AppProvider";
import type { Move } from "@/types/game";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function GamePage() {
  const params = useParams<{ gameId: string }>();
  const gameId = params.gameId;
  const router = useRouter();
  const {
    syncGame,
    markGameReady,
    submitMove,
    finalizeGameResult,
    activeGame,
  } = useApp();
  const [leaveOpen, setLeaveOpen] = useState(false);
  const finalized = useRef(false);

  useEffect(() => {
    syncGame(gameId);
    const interval = setInterval(() => {
      syncGame(gameId);
    }, 100);
    return () => clearInterval(interval);
  }, [gameId, syncGame]);

  const game = activeGame?.id === gameId ? activeGame : null;

  useEffect(() => {
    if (game?.phase === "waiting_ready" && !game.you.ready) {
      void markGameReady(gameId);
    }
  }, [game, gameId, markGameReady]);

  useEffect(() => {
    if (game?.phase === "result" && game.result && !finalized.current) {
      finalized.current = true;
      finalizeGameResult(game);
      router.push(`/result/${gameId}`);
    }
  }, [game, gameId, finalizeGameResult, router]);

  if (!game) {
    return <p className="text-center text-text-secondary">Loading game…</p>;
  }

  const onMove = (move: Move) => {
    if (game.phase !== "choosing_move" || game.you.moveLocked) return;
    void submitMove(gameId, move);
  };

  const showMoves = game.phase === "choosing_move" || game.phase === "move_locked" || game.phase === "reveal";
  const timerDisplay = game.phase === "choosing_move" ? game.moveTimer.toFixed(1) : null;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <p className="text-center text-sm font-semibold uppercase tracking-widest text-text-muted">
        Round {game.round}
      </p>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <PlayerCard label="You" address={game.you.address} stake={game.stake} />
        <div className="text-center">
          <p className="text-sm text-text-muted">Stake</p>
          <p className="text-xl font-bold">
            {formatRps(game.stake)} <span className="text-text-muted">vs</span>{" "}
            {formatRps(game.stake)}
          </p>
          {timerDisplay ? (
            <p className="mt-4 text-4xl font-black tabular-nums text-primary">{timerDisplay}</p>
          ) : null}
        </div>
        <PlayerCard label="Opponent" address={game.opponent.address} stake={game.stake} />
      </div>

      {game.phase === "countdown" && game.countdown !== null ? (
        <CountdownDisplay
          label={game.countdown > 0 ? "Get ready" : "Go"}
          value={game.countdown > 0 ? game.countdown : "GO"}
        />
      ) : null}

      {game.phase === "waiting_ready" ? (
        <Card className="text-center text-text-secondary">Waiting for both players to ready…</Card>
      ) : null}

      {showMoves ? (
        <div className="space-y-4">
          <h2 className="text-center text-lg font-bold uppercase tracking-wider">
            {game.you.moveLocked ? "Your move" : "Choose your move"}
          </h2>

          {game.you.moveLocked && game.you.move ? (
            <Card className="text-center">
              <p className="text-5xl">{MOVE_EMOJI[game.you.move]}</p>
              <p className="mt-2 font-bold">{MOVE_LABEL[game.you.move]}</p>
              <p className="mt-2 text-sm text-success">✓ Move locked</p>
              <p className="text-text-secondary">
                {game.opponent.moveLocked
                  ? "Both moves locked — revealing…"
                  : "Waiting for opponent…"}
              </p>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {(["rock", "paper", "scissors"] as Move[]).map((m) => (
                <GameMoveButton key={m} move={m} onSelect={() => onMove(m)} />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {game.phase === "reveal" ? (
        <CountdownDisplay label="Revealing" value="…" />
      ) : null}

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-text-muted hover:text-danger"
          onClick={() => setLeaveOpen(true)}
        >
          Leave game
        </button>
      </div>

      <Modal open={leaveOpen} onClose={() => setLeaveOpen(false)} title="Leave game?">
        <p className="text-sm text-text-secondary">
          Leaving may affect the outcome of this match.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button fullWidth onClick={() => setLeaveOpen(false)}>
            Stay in game
          </Button>
          <Link href="/lobby">
            <Button variant="destructive" fullWidth>
              Leave game
            </Button>
          </Link>
        </div>
      </Modal>
    </div>
  );
}
