export interface TokenBalance {
  rps: number;
  eth: number;
}

export interface RpsQuote {
  rpsAmount: number;
  ethCost: number;
  networkFeeEth: number;
  totalEth: number;
}
