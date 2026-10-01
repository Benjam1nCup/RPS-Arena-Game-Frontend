"use client";

import { MOVE_EMOJI, MOVE_LABEL } from "@/lib/constants";
import type { Move } from "@/types/game";
import { cn } from "@/lib/utils";

export function GameMoveButton({
  move,
  selected,
  disabled,
  onSelect,
}: {
  move: Move;
  selected?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex min-h-[110px] w-full flex-col items-center justify-center rounded-3xl border-4 border-black px-4 py-6 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-black disabled:opacity-40",
        selected ? "bg-black text-[#FFD445]" : "bg-white text-black hover:scale-[1.02]",
      )}
      aria-pressed={selected}
    >
      <span className="text-4xl" aria-hidden>
        {MOVE_EMOJI[move]}
      </span>
      <span className="mt-2 text-sm font-bold tracking-wider">{MOVE_LABEL[move]}</span>
    </button>
  );
}
