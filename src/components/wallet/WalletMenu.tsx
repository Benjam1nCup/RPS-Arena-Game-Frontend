"use client";

import { BalanceDisplay } from "@/components/balance/BalanceDisplay";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppProvider";
import { shortenAddress } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export function WalletMenu() {
  const { wallet, openConnectModal, disconnectWallet, pushToast } = useApp();
  const [open, setOpen] = useState(false);

  if (!wallet?.connected) {
    return (
      <Button variant="primary" onClick={openConnectModal} className="py-2 text-xs sm:text-sm">
        Connect wallet
      </Button>
    );
  }

  const copy = async () => {
    await navigator.clipboard.writeText(wallet.address);
    pushToast("Address copied");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="sixtep-pill-btn sixtep-pill-secondary max-w-[220px] px-4 py-2 text-left text-xs sm:text-sm"
      >
        <BalanceDisplay compact />
        <span className="mt-1 block font-mono text-[10px] opacity-70">
          {shortenAddress(wallet.address)}
        </span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Wallet">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => void copy()}
            className="font-mono text-lg hover:underline"
          >
            {shortenAddress(wallet.address, 6)}
          </button>
          <BalanceDisplay />
          <Link href="/profile" onClick={() => setOpen(false)}>
            <Button variant="secondary" fullWidth>
              View profile
            </Button>
          </Link>
          <Button
            variant="destructive"
            fullWidth
            onClick={() => {
              void disconnectWallet();
              setOpen(false);
            }}
          >
            Disconnect
          </Button>
        </div>
      </Modal>
    </>
  );
}
