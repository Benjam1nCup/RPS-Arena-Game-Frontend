import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type CardTone = "dark" | "light";

export function Card({
  className,
  tone = "dark",
  framed = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: CardTone; framed?: boolean }) {
  const panelClass = tone === "dark" ? "sixtep-panel" : "sixtep-panel-light";

  if (!framed) {
    return <div className={cn(panelClass, className)} {...props} />;
  }

  return (
    <div className={cn("sixtep-dot-frame", className)}>
      <div className={panelClass} {...props} />
    </div>
  );
}
