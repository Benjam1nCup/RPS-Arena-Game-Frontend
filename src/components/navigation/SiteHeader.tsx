"use client";

import { BrandAvatar } from "@/components/brand/BrandAvatar";
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

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sixtep-nav sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <BrandAvatar size="nav" />
          <span className="sr-only">{APP_NAME}</span>
          <span className="hidden font-display text-sm font-black uppercase tracking-[0.15em] sm:inline">
            RPS Arena
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "sixtep-nav-link",
                (pathname === l.href || pathname.startsWith(`${l.href}/`)) &&
                  "sixtep-nav-link-active",
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
          className="sixtep-pill-btn sixtep-pill-secondary px-3 py-2 text-sm md:hidden"
          aria-expanded={menuOpen}
          aria-label="Open menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-black/10 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {[...links, { href: "/how-it-works", label: "How It Works" }, { href: "/profile", label: "Profile" }].map(
              (l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="sixtep-nav-link"
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
