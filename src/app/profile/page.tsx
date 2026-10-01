"use client";

import { BalanceDisplay } from "@/components/balance/BalanceDisplay";
import { Card } from "@/components/common/Card";
import { useApp } from "@/context/AppProvider";
import { shortenAddress } from "@/lib/utils";

export default function ProfilePage() {
  const { wallet, profile } = useApp();
  const winRate =
    profile.gamesPlayed > 0
      ? ((profile.wins / profile.gamesPlayed) * 100).toFixed(1)
      : "0";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card className="space-y-4">
        <div>
          <p className="text-xs uppercase text-text-muted">Wallet</p>
          <p className="font-mono">{wallet ? shortenAddress(wallet.address, 6) : "Not connected"}</p>
        </div>
        <BalanceDisplay />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-muted">Games played</p>
            <p className="text-xl font-bold">{profile.gamesPlayed}</p>
          </div>
          <div>
            <p className="text-text-muted">Win rate</p>
            <p className="text-xl font-bold">{winRate}%</p>
          </div>
          <div>
            <p className="text-text-muted">Wins</p>
            <p className="text-xl font-bold text-success">{profile.wins}</p>
          </div>
          <div>
            <p className="text-text-muted">Losses</p>
            <p className="text-xl font-bold text-danger">{profile.losses}</p>
          </div>
          <div>
            <p className="text-text-muted">Draws</p>
            <p className="text-xl font-bold">{profile.draws}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
