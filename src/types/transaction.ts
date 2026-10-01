export type TransactionKind = "buy_rps" | "game_payout" | "game_stake";

export type TransactionStep =
  | "preparing"
  | "waiting_for_wallet"
  | "submitted"
  | "confirming"
  | "success"
  | "failed";

export interface TransactionRecord {
  id: string;
  kind: TransactionKind;
  step: TransactionStep;
  title: string;
  rpsDelta?: number;
  ethAmount?: number;
  newRpsBalance?: number;
  errorMessage?: string;
}
