"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "destructive" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-black hover:bg-primary-hover font-semibold tracking-wide",
  secondary:
    "bg-surface-secondary text-text-primary border border-border hover:border-primary/50",
  destructive:
    "bg-danger/15 text-danger border border-danger/40 hover:bg-danger/25",
  ghost: "bg-transparent text-text-secondary hover:text-text-primary",
};

export function Button({
  className,
  variant = "primary",
  fullWidth,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
