"use client";

import { useApp } from "@/context/AppProvider";
import { formatEth, formatRps } from "@/lib/utils";
import Link from "next/link";

export function BalanceDisplay({ compact }: { compact?: boolean }) {
  const { balance, balanceLoading } = useApp();

  if (balanceLoading) {
    return <span className="text-sm opacity-60">Loading…</span>;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm font-bold">
        <span>{formatRps(balance.rps)} RPS</span>
        <span className="opacity-60">{formatEth(balance.eth)} ETH</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs font-bold uppercase tracking-wider opacity-70">Your balance</p>
      <p className="font-display text-2xl font-black">{formatRps(balance.rps)} RPS</p>
      <p className="text-sm opacity-70">≈ {formatEth(balance.eth)} ETH</p>
      <Link href="/buy" className="text-sm font-bold underline-offset-2 hover:underline">
        Buy RPS
      </Link>
    </div>
  );
}
