"use client";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppProvider";
import { formatRps } from "@/lib/utils";

export function InsufficientBalanceModal() {
  const { insufficientModal, hideInsufficient, openBuyModal, stakeIntent } = useApp();
  const { open, required, balance } = insufficientModal;
  const need = Math.max(0, required - balance);

  return (
    <Modal open={open} onClose={hideInsufficient} title="Not enough RPS">
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-text-muted">Your balance</span>
          <span>{formatRps(balance)} RPS</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Required</span>
          <span>{formatRps(required)} RPS</span>
        </div>
        <div className="flex justify-between font-semibold text-primary">
          <span>You need</span>
          <span>{formatRps(need)} more RPS</span>
        </div>
        <Button
          fullWidth
          onClick={() => {
            hideInsufficient();
            openBuyModal({ returnPath: "/lobby", requiredStake: stakeIntent ?? required });
          }}
        >
          Buy RPS
        </Button>
      </div>
    </Modal>
  );
}
