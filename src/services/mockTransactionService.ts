import { DELAYS } from "@/lib/constants";
import { delay, randomBetween } from "@/lib/utils";
import type { TransactionService } from "./interfaces";
import { getBalanceSync, mockTokenService } from "./mockTokenService";

export const mockTransactionService: TransactionService = {
  async runPurchase(quote, onStep) {
    const id = `tx-${Date.now()}`;
    const failRandomly = false;

    onStep("preparing");
    await delay(400);
    onStep("waiting_for_wallet");
    await delay(900);
    onStep("submitted");
    await delay(500);
    onStep("confirming");
    await delay(randomBetween(DELAYS.txConfirmMin, DELAYS.txConfirmMax));

    if (failRandomly) {
      onStep("failed");
      return {
        id,
        kind: "buy_rps",
        step: "failed",
        title: "PURCHASING RPS",
        errorMessage: "Transaction reverted",
      };
    }

    await mockTokenService.buyRPS(quote.rpsAmount);
    const bal = getBalanceSync();
    onStep("success");
    return {
      id,
      kind: "buy_rps",
      step: "success",
      title: "PURCHASING RPS",
      rpsDelta: quote.rpsAmount,
      ethAmount: quote.totalEth,
      newRpsBalance: bal.rps,
    };
  },
};
