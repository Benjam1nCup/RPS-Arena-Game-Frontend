"use client";

import { BuyRPSModal } from "@/components/buy/BuyRPSModal";
import { ToastStack } from "@/components/common/ToastStack";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InsufficientBalanceModal } from "@/components/lobby/InsufficientBalanceModal";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { TransactionModal } from "@/components/transaction/TransactionModal";
import { ConnectWalletModal } from "@/components/wallet/ConnectWalletModal";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="sixtep-app flex min-h-screen flex-col">
      <SiteHeader />
      <main className="relative z-[2] mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-10">
        {children}
      </main>
      <SiteFooter />
      <ConnectWalletModal />
      <BuyRPSModal />
      <TransactionModal />
      <InsufficientBalanceModal />
      <ToastStack />
    </div>
  );
}
