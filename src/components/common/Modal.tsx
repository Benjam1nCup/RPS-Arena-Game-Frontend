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
      className="sixtep-modal-overlay fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={cn(
          "sixtep-modal-panel max-h-[90vh] w-full max-w-md overflow-y-auto p-6 animate-fade-in",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <h2 className="mb-4 font-display text-lg font-black uppercase tracking-wide">{title}</h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}
