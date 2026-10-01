import { DELAYS, NETWORK_FEE_ETH, RPS_PER_ETH } from "@/lib/constants";
import { delay } from "@/lib/utils";
import type { RpsQuote, TokenBalance } from "@/types/token";
import type { TokenService } from "./interfaces";

const BALANCE_KEY = "rps-arena-balance";

let balance: TokenBalance = { rps: 1250, eth: 0.15 };

function loadBalance(): TokenBalance {
  if (typeof window === "undefined") return balance;
  try {
    const raw = sessionStorage.getItem(BALANCE_KEY);
    if (raw) balance = JSON.parse(raw) as TokenBalance;
  } catch {
    /* keep default */
  }
  return balance;
}

function saveBalance(b: TokenBalance) {
  balance = b;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(BALANCE_KEY, JSON.stringify(b));
  }
}

export const mockTokenService: TokenService = {
  async getBalance() {
    await delay(DELAYS.balanceLoad);
    return { ...loadBalance() };
  },

  getQuote(rpsAmount: number): RpsQuote {
    const ethCost = rpsAmount / RPS_PER_ETH;
    const networkFeeEth = NETWORK_FEE_ETH;
    return {
      rpsAmount,
      ethCost,
      networkFeeEth,
      totalEth: ethCost + networkFeeEth,
    };
  },

  async buyRPS(rpsAmount: number) {
    const quote = this.getQuote(rpsAmount);
    const b = loadBalance();
    if (b.eth < quote.totalEth) {
      throw new Error("Insufficient ETH");
    }
    saveBalance({
      rps: b.rps + rpsAmount,
      eth: b.eth - quote.totalEth,
    });
    return { rpsAmount };
  },
};

export function getBalanceSync(): TokenBalance {
  return { ...loadBalance() };
}

export function applyGamePayout(deltaRps: number, stakeOnLoss = 0) {
  const b = loadBalance();
  saveBalance({
    rps: b.rps + deltaRps - stakeOnLoss,
    eth: b.eth,
  });
}

export function reserveStake(stake: number) {
  const b = loadBalance();
  if (b.rps < stake) throw new Error("Insufficient RPS");
  saveBalance({ rps: b.rps - stake, eth: b.eth });
}

export function releaseStake(stake: number) {
  const b = loadBalance();
  saveBalance({ rps: b.rps + stake, eth: b.eth });
}
