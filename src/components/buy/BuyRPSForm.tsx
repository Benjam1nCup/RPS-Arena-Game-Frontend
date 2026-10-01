"use client";

import { BalanceDisplay } from "@/components/balance/BalanceDisplay";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { formatEth, formatRps } from "@/lib/utils";
import { useApp } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function BuyRPSForm({
  onDone,
  inModal,
}: {
  onDone?: () => void;
  inModal?: boolean;
}) {
  const {
    balance,
    getQuote,
    runPurchase,
    setTxModal,
    returnPathAfterBuy,
    setReturnPathAfterBuy,
    stakeIntent,
    openConnectModal,
    wallet,
  } = useApp();
  const router = useRouter();
  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [review, setReview] = useState(false);

  const rpsAmount = custom ? Number(custom) : amount;
  const valid = Number.isFinite(rpsAmount) && rpsAmount > 0;

  const quote = useMemo(
    () => (valid ? getQuote(rpsAmount) : null),
    [getQuote, rpsAmount, valid],
  );

  const onPurchase = async () => {
    if (!wallet?.connected) {
      openConnectModal();
      return;
    }
    if (!quote) return;
    setConfirming(true);
    setTxModal({
      id: "pending",
      kind: "buy_rps",
      step: "preparing",
      title: "PURCHASING RPS",
    });
    const result = await runPurchase(quote);
    setConfirming(false);
    if (result.step === "success") {
      onDone?.();
      const dest = returnPathAfterBuy ?? (stakeIntent ? "/lobby" : null);
      setReturnPathAfterBuy(null);
      if (dest && !inModal) router.push(dest);
    }
  };

  return (
    <div className="space-y-6">
      {!inModal ? (
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buy RPS</h1>
          <p className="mt-2 text-text-secondary">Purchase RPS without leaving the arena.</p>
        </div>
      ) : null}

      <BalanceDisplay />

      <div>
        <p className="mb-3 text-sm font-medium text-text-secondary">Choose amount</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[100, 500, 1000, 5000].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setCustom("");
                setAmount(n);
              }}
              className={`rounded-lg border px-3 py-3 text-sm font-semibold ${
                !custom && amount === n
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-surface-secondary"
              }`}
            >
              {formatRps(n)}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Custom amount"
        inputMode="numeric"
        placeholder="250"
        value={custom}
        onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))}
        error={custom && !valid ? "Amount must be greater than 0." : undefined}
      />

      {quote ? (
        <div className="space-y-3 rounded-lg border border-border bg-surface-secondary p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">You pay</span>
            <span className="font-semibold">{formatEth(quote.totalEth)} ETH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">You receive</span>
            <span className="font-semibold text-primary">{formatRps(quote.rpsAmount)} RPS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Network fee</span>
            <span>{formatEth(quote.networkFeeEth)} ETH</span>
          </div>
        </div>
      ) : null}

      {!review ? (
        <Button fullWidth disabled={!valid} onClick={() => setReview(true)}>
          Review purchase
        </Button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Confirm purchase
          </p>
          {quote ? (
            <p className="text-text-secondary">
              New balance:{" "}
              <span className="font-semibold text-text-primary">
                {formatRps(balance.rps + quote.rpsAmount)} RPS
              </span>
            </p>
          ) : null}
          <Button fullWidth disabled={!valid || confirming} onClick={() => void onPurchase()}>
            Confirm purchase
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setReview(false)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
