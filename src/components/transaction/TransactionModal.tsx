"use client";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppProvider";
import { formatRps } from "@/lib/utils";
import Link from "next/link";

const steps = [
  "preparing",
  "waiting_for_wallet",
  "submitted",
  "confirming",
  "success",
] as const;

const labels: Record<(typeof steps)[number], string> = {
  preparing: "Preparing transaction",
  waiting_for_wallet: "Waiting for wallet approval",
  submitted: "Transaction submitted",
  confirming: "Confirming",
  success: "Complete",
};

export function TransactionModal() {
  const { txModal, setTxModal } = useApp();
  if (!txModal) return null;

  const stepIndex = steps.indexOf(
    txModal.step === "failed" ? "confirming" : (txModal.step as (typeof steps)[number]),
  );

  return (
    <Modal
      open
      onClose={() => {
        if (txModal.step === "success" || txModal.step === "failed") setTxModal(null);
      }}
      title={txModal.step === "success" ? "Purchase complete" : txModal.title}
    >
      {txModal.step !== "failed" && txModal.step !== "success" ? (
        <ul className="space-y-2 text-sm text-text-secondary">
          {steps.slice(0, 4).map((s, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <li key={s} className={active ? "text-primary" : done ? "text-success" : ""}>
                {done ? "✓ " : active ? "● " : "○ "}
                {labels[s]}
              </li>
            );
          })}
        </ul>
      ) : null}

      {txModal.step === "success" ? (
        <div className="space-y-4 text-center">
          <p className="text-3xl font-bold text-success">+{formatRps(txModal.rpsDelta ?? 0)} RPS</p>
          <p className="text-text-secondary">
            New balance{" "}
            <span className="font-semibold text-text-primary">
              {formatRps(txModal.newRpsBalance ?? 0)} RPS
            </span>
          </p>
          <Link href="/lobby">
            <Button fullWidth onClick={() => setTxModal(null)}>
              Play now
            </Button>
          </Link>
        </div>
      ) : null}

      {txModal.step === "failed" ? (
        <div className="space-y-4">
          <p className="text-text-secondary">Your purchase was not completed.</p>
          <Button fullWidth onClick={() => setTxModal(null)}>
            Try again
          </Button>
        </div>
      ) : null}
    </Modal>
  );
}
