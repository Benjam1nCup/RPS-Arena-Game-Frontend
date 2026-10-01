"use client";

import { useApp } from "@/context/AppProvider";

export function useWallet() {
  const {
    wallet,
    walletPhase,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    openConnectModal,
    closeConnectModal,
    connectModalOpen,
    requiredNetwork,
  } = useApp();
  return {
    wallet,
    walletPhase,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    openConnectModal,
    closeConnectModal,
    connectModalOpen,
    requiredNetwork,
  };
}
