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
            "animate-fade-in rounded-lg border px-4 py-3 text-sm shadow-card",
            t.variant === "success" && "border-success/40 bg-success/10 text-success",
            t.variant === "error" && "border-danger/40 bg-danger/10 text-danger",
            t.variant === "info" && "border-border bg-surface text-text-primary",
          )}
          role="status"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
