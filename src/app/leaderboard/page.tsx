import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { mockLeaderboard } from "@/data/mockData";
import { formatRps, shortenAddress } from "@/lib/utils";
import Link from "next/link";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      {mockLeaderboard.length === 0 ? (
        <Card className="text-center">
          <p>No players yet</p>
          <Link href="/lobby" className="mt-4 inline-block">
            <Button>Play now</Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-border md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-secondary text-text-muted">
                <tr>
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3">Wins</th>
                  <th className="px-4 py-3">RPS won</th>
                </tr>
              </thead>
              <tbody>
                {mockLeaderboard.map((row) => (
                  <tr key={row.address} className="border-t border-border">
                    <td className="px-4 py-3 font-mono">{shortenAddress(row.address)}</td>
                    <td className="px-4 py-3">{row.wins}</td>
                    <td className="px-4 py-3">{formatRps(row.rpsWon)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {mockLeaderboard.map((row) => (
              <Card key={row.address}>
                <p className="font-mono">{shortenAddress(row.address)}</p>
                <p className="mt-2 text-sm">
                  {row.wins} wins · {formatRps(row.rpsWon)} RPS won
                </p>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
