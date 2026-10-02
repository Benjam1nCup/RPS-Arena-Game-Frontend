import { BRAND_AVATAR_SRC } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

/** Source artwork is 689×1024 (portrait). */
const LOGO_ASPECT = 689 / 1024;

type BrandAvatarSize = "nav" | "hero" | "sm";

const sizes: Record<
  BrandAvatarSize,
  { className: string; width: number; height: number; priority?: boolean }
> = {
  nav: { className: "h-11 w-auto", width: 44, height: Math.round(44 / LOGO_ASPECT) },
  sm: { className: "h-9 w-auto", width: 36, height: Math.round(36 / LOGO_ASPECT) },
  hero: {
    className: "h-auto w-full max-w-[280px]",
    width: 689,
    height: 1024,
    priority: true,
  },
};

export function BrandAvatar({
  size = "nav",
  className,
}: {
  size?: BrandAvatarSize;
  className?: string;
}) {
  const cfg = sizes[size];
  return (
    <Image
      src={BRAND_AVATAR_SRC}
      alt="RPS Arena"
      width={cfg.width}
      height={cfg.height}
      priority={cfg.priority}
      className={cn(
        "rounded-2xl border-2 border-black object-contain shadow-[4px_4px_0_rgba(0,0,0,0.15)]",
        cfg.className,
        className,
      )}
    />
  );
}
