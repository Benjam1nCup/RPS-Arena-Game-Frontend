import { AppShell } from "@/components/layout/AppShell";
import { AppProvider } from "@/context/AppProvider";
import { BRAND_AVATAR_SRC } from "@/lib/constants";
import type { Metadata, Viewport } from "next";
import { Archivo_Black, Caveat, Space_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#FFD445",
};

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "RPS Arena — Rock Paper Scissors",
  description: "Real-time multiplayer Rock Paper Scissors. Simple. Fast. Player vs player.",
  icons: {
    icon: [{ url: "/favicon.jpg", type: "image/jpeg" }],
    apple: [{ url: "/apple-touch-icon.jpg", type: "image/jpeg" }],
  },
  openGraph: {
    title: "RPS Arena",
    description: "Real-time multiplayer Rock Paper Scissors.",
    images: [{ url: BRAND_AVATAR_SRC, width: 689, height: 1024, alt: "RPS Arena" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} ${archivoBlack.variable} ${caveat.variable}`}
    >
      <body className="antialiased">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
