"use client";

import { useApp } from "@/context/AppProvider";

export function useMatch() {
  const { matchStatus, findQuickMatch, cancelMatchmaking, stakeIntent, setStakeIntent } =
    useApp();
  return { matchStatus, findQuickMatch, cancelMatchmaking, stakeIntent, setStakeIntent };
}
