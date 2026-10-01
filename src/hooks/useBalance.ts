"use client";

import { useApp } from "@/context/AppProvider";

export function useBalance() {
  const { balance, balanceLoading, refreshBalance, openBuyModal } = useApp();
  return { balance, balanceLoading, refreshBalance, openBuyModal };
}
