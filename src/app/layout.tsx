import { AppShell } from "@/components/layout/AppShell";
import { AppProvider } from "@/context/AppProvider";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "RPS Arena — Rock Paper Scissors",
  description: "Real-time multiplayer Rock Paper Scissors on Web3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
