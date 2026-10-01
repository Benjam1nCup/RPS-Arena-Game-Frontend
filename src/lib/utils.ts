import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`;
}

export function formatRps(amount: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(amount));
}

export function formatEth(amount: number): string {
  return amount.toFixed(amount >= 1 ? 2 : 3);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function identiconHue(address: string): number {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function calcPrizeBreakdown(stake: number) {
  const yourStake = stake;
  const opponentStake = stake;
  const pool = yourStake + opponentStake;
  const platformFee = Math.round(pool * 0.05);
  const winnerPayout = pool - platformFee;
  return { yourStake, opponentStake, platformFee, winnerPayout };
}
