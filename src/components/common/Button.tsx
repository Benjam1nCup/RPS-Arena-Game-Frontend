"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "destructive" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "sixtep-pill-btn sixtep-pill-primary px-6 py-3 text-sm",
  secondary: "sixtep-pill-btn sixtep-pill-secondary px-6 py-3 text-sm",
  destructive: "sixtep-pill-btn sixtep-pill-danger px-6 py-3 text-sm",
  ghost: "bg-transparent px-3 py-2 text-sm uppercase tracking-wide text-black/70 hover:text-black",
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
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
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
