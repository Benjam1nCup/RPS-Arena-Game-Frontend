import { MOCK_OPPONENT_ADDRESS, MOCK_WALLET_ADDRESS } from "@/lib/constants";
import type { Room } from "@/types/room";

export interface MockLeaderboardEntry {
  address: string;
  wins: number;
  rpsWon: number;
}

export interface MockHistoryEntry {
  id: string;
  outcome: "win" | "lose" | "draw";
  stake: number;
  payout: number;
  opponent: string;
  yourMove: string;
  opponentMove: string;
  playedAt: string;
}

export const mockLeaderboard: MockLeaderboardEntry[] = [
  { address: MOCK_WALLET_ADDRESS, wins: 25, rpsWon: 12500 },
  { address: MOCK_OPPONENT_ADDRESS, wins: 22, rpsWon: 10200 },
  { address: "0x21Aa3Bc4d5E6f789012345678901234567890AA", wins: 19, rpsWon: 8950 },
  { address: "0x12Ab8Ac9d0E1f234567890123456789012348A", wins: 15, rpsWon: 6200 },
];

export const initialPublicRooms: Room[] = [
  {
    id: "1001",
    stake: 10,
    visibility: "public",
    hostAddress: "0x12Ab8Ac9d0E1f234567890123456789012348A",
    status: "waiting",
    players: [
      {
        address: "0x12Ab8Ac9d0E1f234567890123456789012348A",
        stake: 10,
        ready: false,
      },
    ],
  },
  {
    id: "1002",
    stake: 50,
    visibility: "public",
    hostAddress: MOCK_OPPONENT_ADDRESS,
    status: "waiting",
    players: [{ address: MOCK_OPPONENT_ADDRESS, stake: 50, ready: false }],
  },
  {
    id: "1003",
    stake: 100,
    visibility: "public",
    hostAddress: "0x21Aa3Bc4d5E6f789012345678901234567890AA",
    status: "waiting",
    players: [
      {
        address: "0x21Aa3Bc4d5E6f789012345678901234567890AA",
        stake: 100,
        ready: false,
      },
    ],
  },
  {
    id: "1004",
    stake: 500,
    visibility: "public",
    hostAddress: "0x55Cc6Dd7e8F9012345678901234567890123455CC",
    status: "waiting",
    players: [
      {
        address: "0x55Cc6Dd7e8F9012345678901234567890123455CC",
        stake: 500,
        ready: false,
      },
    ],
  },
];

export const defaultHistory: MockHistoryEntry[] = [
  {
    id: "g-001",
    outcome: "win",
    stake: 100,
    payout: 190,
    opponent: "0x12Ab8Ac9d0E1f234567890123456789012348A",
    yourMove: "rock",
    opponentMove: "scissors",
    playedAt: "2026-09-28T14:22:00Z",
  },
  {
    id: "g-002",
    outcome: "lose",
    stake: 100,
    payout: -100,
    opponent: MOCK_OPPONENT_ADDRESS,
    yourMove: "rock",
    opponentMove: "paper",
    playedAt: "2026-09-27T09:10:00Z",
  },
  {
    id: "g-003",
    outcome: "draw",
    stake: 50,
    payout: 0,
    opponent: "0x21Aa3Bc4d5E6f789012345678901234567890AA",
    yourMove: "rock",
    opponentMove: "rock",
    playedAt: "2026-09-26T18:45:00Z",
  },
];

export const profileStats = {
  gamesPlayed: 42,
  wins: 25,
  losses: 14,
  draws: 3,
};
