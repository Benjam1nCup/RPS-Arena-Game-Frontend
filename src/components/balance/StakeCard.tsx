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
        "min-h-[72px] rounded-2xl border-2 border-black px-4 py-4 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-black",
        selected
          ? "bg-black text-[#FFD445] shadow-[0_6px_0_rgba(0,0,0,0.15)]"
          : "bg-white text-black hover:scale-[1.02]",
      )}
      aria-pressed={selected}
    >
      <span className="block text-lg font-bold">{formatRps(amount)} RPS</span>
      {selected ? <span className="mt-1 block text-xs">✓</span> : null}
    </button>
  );
}
