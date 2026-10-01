"use client";

import { useApp } from "@/context/AppProvider";

export function useTransaction() {
  const { txModal, setTxModal, runPurchase, getQuote } = useApp();
  return { txModal, setTxModal, runPurchase, getQuote };
}
