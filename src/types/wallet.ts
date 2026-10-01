export type NetworkId = "robinhood" | "wrong";

export interface Wallet {
  address: string;
  network: NetworkId;
  connected: boolean;
}

export type WalletConnectPhase =
  | "idle"
  | "connecting"
  | "connected"
  | "wrong_network"
  | "failed";
