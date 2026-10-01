"use client";

import { WalletMenu } from "@/components/wallet/WalletMenu";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/lobby", label: "Play" },
  { href: "/buy", label: "Buy RPS" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/history", label: "History" },
];

const guestLinks = [
  { href: "/lobby", label: "Play" },
  { href: "/how-it-works", label: "How It Works" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-widest text-text-primary">
          {APP_NAME.toUpperCase()}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition hover:text-primary",
                pathname === l.href ? "text-primary" : "text-text-secondary",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <WalletMenu />
        </div>

        <button
          type="button"
          className="rounded-lg border border-border px-3 py-2 text-text-primary md:hidden"
          aria-expanded={menuOpen}
          aria-label="Open menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-border px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {[...guestLinks, ...links.slice(2), { href: "/profile", label: "Profile" }].map(
              (l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-text-secondary hover:text-primary"
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>
          <div className="mt-4">
            <WalletMenu />
          </div>
        </div>
      ) : null}
    </header>
  );
}
