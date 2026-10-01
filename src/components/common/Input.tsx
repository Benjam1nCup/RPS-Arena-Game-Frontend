"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wider text-black/70">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn("sixtep-input", error && "border-[var(--sixtep-red)]", className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-sm text-[var(--sixtep-red)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
