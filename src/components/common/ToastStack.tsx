"use client";

import { useApp } from "@/context/AppProvider";
import { cn } from "@/lib/utils";

export function ToastStack() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "sixtep-callout animate-fade-in pointer-events-auto",
            t.variant === "error" && "border-[var(--sixtep-red)] text-[var(--sixtep-red)]",
          )}
          role="status"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
