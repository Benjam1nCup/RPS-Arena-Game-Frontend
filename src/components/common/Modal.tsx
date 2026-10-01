"use client";

import { cn } from "@/lib/utils";
import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={cn(
          "max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-border bg-surface p-6 shadow-card animate-fade-in",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <h2 className="mb-4 text-lg font-semibold tracking-wide text-text-primary">
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}
