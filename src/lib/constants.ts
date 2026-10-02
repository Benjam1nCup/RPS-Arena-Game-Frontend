export const APP_NAME = "RPS Arena";

export const BRAND_AVATAR_SRC = "/brand/rps-arena-logo.jpg";

export const STAKE_PRESETS = [10, 50, 100, 500] as const;

export const PLATFORM_FEE_RATE = 0.05;

export const REQUIRED_NETWORK = "Robinhood Chain";

export const MOCK_WALLET_ADDRESS = "0x8291a4B2c3D4e5F6789012345678901234567891F";

export const MOCK_OPPONENT_ADDRESS = "0x91Ab4Bc2d3E4f567890123456789012345678904B";

export const RPS_PER_ETH = 10000;

export const NETWORK_FEE_ETH = 0.001;

export const DELAYS = {
  walletConnect: 800,
  balanceLoad: 500,
  findOpponentMin: 1000,
  findOpponentMax: 4000,
  opponentJoinMin: 2000,
  opponentJoinMax: 5000,
  txConfirmMin: 2000,
  txConfirmMax: 4000,
  reveal: 1000,
} as const;

export const MOVE_EMOJI: Record<string, string> = {
  rock: "✊",
  paper: "✋",
  scissors: "✌",
};

export const MOVE_LABEL: Record<string, string> = {
  rock: "ROCK",
  paper: "PAPER",
  scissors: "SCISSORS",
};
