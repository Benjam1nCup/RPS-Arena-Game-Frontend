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
        className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-left transition hover:border-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <BalanceDisplay compact />
        <span className="mt-1 block font-mono text-xs text-text-muted">
          {shortenAddress(wallet.address)}
        </span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Wallet">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => void copy()}
            className="font-mono text-lg text-text-primary hover:text-primary"
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
