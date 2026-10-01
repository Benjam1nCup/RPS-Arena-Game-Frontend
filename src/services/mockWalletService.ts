import { DELAYS, MOCK_WALLET_ADDRESS, REQUIRED_NETWORK } from "@/lib/constants";
import { delay } from "@/lib/utils";
import type { Wallet } from "@/types/wallet";
import type { WalletService } from "./interfaces";

const STORAGE_KEY = "rps-arena-wallet";

let memoryWallet: Wallet | null = null;

function load(): Wallet | null {
  if (typeof window === "undefined") return memoryWallet;
  if (memoryWallet) return memoryWallet;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) memoryWallet = JSON.parse(raw) as Wallet;
  } catch {
    memoryWallet = null;
  }
  return memoryWallet;
}

function save(wallet: Wallet | null) {
  memoryWallet = wallet;
  if (typeof window === "undefined") return;
  if (wallet) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  else sessionStorage.removeItem(STORAGE_KEY);
}

export const mockWalletService: WalletService = {
  async connect(simulateWrongNetwork = false) {
    await delay(DELAYS.walletConnect);
    const wallet: Wallet = {
      address: MOCK_WALLET_ADDRESS,
      network: simulateWrongNetwork ? "wrong" : "robinhood",
      connected: true,
    };
    save(wallet);
    return wallet;
  },

  async disconnect() {
    await delay(200);
    save(null);
  },

  getWallet() {
    return load();
  },

  async switchNetwork() {
    await delay(600);
    const current = load();
    if (!current) throw new Error("No wallet");
    const updated: Wallet = { ...current, network: "robinhood" };
    save(updated);
    return updated;
  },
};

export function isWrongNetwork(wallet: Wallet | null): boolean {
  return wallet?.connected === true && wallet.network !== "robinhood";
}

export { REQUIRED_NETWORK };
