"use client";

import { cn, formatRps } from "@/lib/utils";

export function StakeCard({
  amount,
  selected,
  onSelect,
}: {
  amount: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "rounded-xl border px-4 py-4 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-surface-secondary text-text-primary hover:border-primary/40",
      )}
      aria-pressed={selected}
    >
      <span className="block text-lg font-semibold">{formatRps(amount)} RPS</span>
      {selected ? <span className="mt-1 block text-xs">✓</span> : null}
    </button>
  );
}
