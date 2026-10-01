import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="sixtep-footer relative z-[2]">
      <Link href="/" className="font-bold underline-offset-2 hover:underline">
        RPS ARENA
      </Link>{" "}
      ·{" "}
      <Link href="/how-it-works" className="underline-offset-2 hover:underline">
        How it works
      </Link>{" "}
      · Real-time PvP Rock Paper Scissors
    </footer>
  );
}
