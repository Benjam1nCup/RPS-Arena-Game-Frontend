"use client";

import { BuyRPSModal } from "@/components/buy/BuyRPSModal";
import { ToastStack } from "@/components/common/ToastStack";
import { InsufficientBalanceModal } from "@/components/lobby/InsufficientBalanceModal";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { TransactionModal } from "@/components/transaction/TransactionModal";
import { ConnectWalletModal } from "@/components/wallet/ConnectWalletModal";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <ConnectWalletModal />
      <BuyRPSModal />
      <TransactionModal />
      <InsufficientBalanceModal />
      <ToastStack />
    </div>
  );
}
