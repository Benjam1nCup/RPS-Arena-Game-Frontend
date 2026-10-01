import type { GameSession, Move } from "@/types/game";
import type { Room } from "@/types/room";
import type { RpsQuote, TokenBalance } from "@/types/token";
import type { TransactionRecord } from "@/types/transaction";
import type { Wallet } from "@/types/wallet";

export interface WalletService {
  connect(simulateWrongNetwork?: boolean): Promise<Wallet>;
  disconnect(): Promise<void>;
  getWallet(): Wallet | null;
  switchNetwork(): Promise<Wallet>;
}

export interface TokenService {
  getBalance(): Promise<TokenBalance>;
  getQuote(rpsAmount: number): RpsQuote;
  buyRPS(rpsAmount: number): Promise<{ rpsAmount: number }>;
}

export interface RoomService {
  getRooms(): Promise<Room[]>;
  getRoom(roomId: string): Promise<Room | null>;
  createRoom(stake: number, visibility: Room["visibility"], host: string): Promise<Room>;
  joinRoom(roomId: string, player: string): Promise<Room>;
  leaveRoom(roomId: string, player: string): Promise<void>;
  setReady(roomId: string, player: string, ready: boolean): Promise<Room>;
}

export interface MatchService {
  findOpponent(stake: number, player: string): Promise<{ room: Room; game: GameSession }>;
  cancelMatch(): void;
}

export interface GameService {
  getGame(gameId: string): GameSession | null;
  createFromRoom(room: Room, you: string): GameSession;
  markReady(gameId: string, address: string): Promise<GameSession>;
  chooseMove(gameId: string, address: string, move: Move): Promise<GameSession>;
  tick(gameId: string): GameSession | null;
}

export interface TransactionService {
  runPurchase(
    quote: RpsQuote,
    onStep: (step: TransactionRecord["step"]) => void,
  ): Promise<TransactionRecord>;
}
