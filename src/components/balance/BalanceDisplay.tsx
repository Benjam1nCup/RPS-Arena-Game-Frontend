"use client";

import { useApp } from "@/context/AppProvider";
import { formatEth, formatRps } from "@/lib/utils";
import Link from "next/link";

export function BalanceDisplay({ compact }: { compact?: boolean }) {
  const { balance, balanceLoading } = useApp();

  if (balanceLoading) {
    return <span className="text-sm text-text-muted">Loading…</span>;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="font-semibold text-primary">{formatRps(balance.rps)} RPS</span>
        <span className="text-text-muted">{formatEth(balance.eth)} ETH</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wider text-text-muted">Your balance</p>
      <p className="text-2xl font-bold text-text-primary">{formatRps(balance.rps)} RPS</p>
      <p className="text-sm text-text-secondary">≈ {formatEth(balance.eth)} ETH</p>
      <Link href="/buy" className="text-sm text-primary hover:underline">
        Buy RPS
      </Link>
    </div>
  );
}
