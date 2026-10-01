import { cn, identiconHue, shortenAddress } from "@/lib/utils";

export function Avatar({
  address,
  size = "md",
}: {
  address: string;
  size?: "sm" | "md" | "lg";
}) {
  const hue = identiconHue(address);
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-base" };
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-mono font-semibold text-white",
        sizes[size],
      )}
      style={{ backgroundColor: `hsl(${hue} 55% 42%)` }}
      aria-hidden
    >
      {shortenAddress(address, 2).replace("0x", "").slice(0, 2).toUpperCase()}
    </div>
  );
}
