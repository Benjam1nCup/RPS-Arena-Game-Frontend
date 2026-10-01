"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { useApp } from "@/context/AppProvider";
import { formatRps, shortenAddress } from "@/lib/utils";
import Link from "next/link";

export default function HistoryPage() {
  const { history } = useApp();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Game history</h1>
      {history.length === 0 ? (
        <Card className="text-center">
          <p className="text-text-secondary">No games yet</p>
          <Link href="/lobby" className="mt-4 inline-block">
            <Button>Play your first game</Button>
          </Link>
        </Card>
      ) : (
        <ul className="space-y-3">
          {history.map((h) => (
            <li key={h.id}>
              <Card className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p
                    className={`text-sm font-bold uppercase ${
                      h.outcome === "win"
                        ? "text-success"
                        : h.outcome === "lose"
                          ? "text-danger"
                          : "text-text-secondary"
                    }`}
                  >
                    {h.outcome}
                  </p>
                  <p className="text-lg font-semibold">
                    {h.payout > 0 ? "+" : ""}
                    {h.outcome === "draw" ? "0" : formatRps(Math.abs(h.payout))} RPS
                  </p>
                  <p className="text-sm text-text-muted">
                    {formatRps(h.stake)} RPS stake · vs {shortenAddress(h.opponent)}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
