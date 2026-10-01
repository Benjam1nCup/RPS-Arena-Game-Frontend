import { Avatar } from "@/components/common/Avatar";
import { formatRps, shortenAddress } from "@/lib/utils";

export function PlayerCard({
  label,
  address,
  stake,
  status,
}: {
  label: string;
  address: string;
  stake: number;
  status?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</p>
      <Avatar address={address} size="lg" />
      <p className="font-mono text-sm">{shortenAddress(address)}</p>
      <p className="text-lg font-bold text-primary">{formatRps(stake)} RPS</p>
      {status ? <p className="text-sm text-text-secondary">{status}</p> : null}
    </div>
  );
}
