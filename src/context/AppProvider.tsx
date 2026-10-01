"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultHistory, profileStats, type MockHistoryEntry } from "@/data/mockData";
import { mockGameService } from "@/services/mockGameService";
import { mockMatchService } from "@/services/mockMatchService";
import {
  getRoomSync,
  mockRoomService,
  setRoomGameId,
  simulateOpponentJoin,
} from "@/services/mockRoomService";
import {
  mockTokenService,
  getBalanceSync,
  applyGamePayout,
  reserveStake,
  releaseStake,
} from "@/services/mockTokenService";
import { mockTransactionService } from "@/services/mockTransactionService";
import {
  isWrongNetwork,
  mockWalletService,
  REQUIRED_NETWORK,
} from "@/services/mockWalletService";
import type { GameSession, MatchmakingStatus } from "@/types/game";
import type { Room } from "@/types/room";
import type { RpsQuote, TokenBalance } from "@/types/token";
import type { TransactionRecord } from "@/types/transaction";
import type { Wallet, WalletConnectPhase } from "@/types/wallet";

const STAKE_INTENT_KEY = "rps-arena-stake-intent";
const RETURN_PATH_KEY = "rps-arena-return-path";

export type ToastVariant = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface AppContextValue {
  wallet: Wallet | null;
  walletPhase: WalletConnectPhase;
  balance: TokenBalance;
  balanceLoading: boolean;
  stakeIntent: number | null;
  returnPathAfterBuy: string | null;
  matchStatus: MatchmakingStatus;
  activeRoom: Room | null;
  activeGame: GameSession | null;
  history: MockHistoryEntry[];
  profile: typeof profileStats;
  toasts: Toast[];
  connectWallet: (opts?: { simulateWrongNetwork?: boolean }) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  switchNetwork: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  setStakeIntent: (stake: number | null) => void;
  setReturnPathAfterBuy: (path: string | null) => void;
  openConnectModal: () => void;
  closeConnectModal: () => void;
  connectModalOpen: boolean;
  buyModalOpen: boolean;
  openBuyModal: (opts?: { returnPath?: string; requiredStake?: number }) => void;
  closeBuyModal: () => void;
  buyRequiredStake: number | null;
  getQuote: (amount: number) => RpsQuote;
  runPurchase: (quote: RpsQuote) => Promise<TransactionRecord>;
  txModal: TransactionRecord | null;
  setTxModal: (tx: TransactionRecord | null) => void;
  pushToast: (message: string, variant?: ToastVariant) => void;
  findQuickMatch: (stake: number) => Promise<void>;
  cancelMatchmaking: () => void;
  createRoom: (stake: number, visibility: Room["visibility"]) => Promise<Room>;
  joinRoom: (roomId: string) => Promise<Room>;
  pollRoom: (roomId: string) => Promise<Room | null>;
  setPlayerReady: (roomId: string) => Promise<void>;
  startGameFromRoom: (room: Room) => GameSession;
  syncGame: (gameId: string) => GameSession | null;
  markGameReady: (gameId: string) => Promise<GameSession>;
  submitMove: (gameId: string, move: import("@/types/game").Move) => Promise<GameSession>;
  finalizeGameResult: (game: GameSession) => void;
  insufficientModal: { open: boolean; required: number; balance: number };
  showInsufficient: (required: number) => void;
  hideInsufficient: () => void;
  requiredNetwork: string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletPhase, setWalletPhase] = useState<WalletConnectPhase>("idle");
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [balance, setBalance] = useState<TokenBalance>({ rps: 0, eth: 0 });
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [stakeIntent, setStakeIntentState] = useState<number | null>(null);
  const [returnPathAfterBuy, setReturnPathState] = useState<string | null>(null);
  const [matchStatus, setMatchStatus] = useState<MatchmakingStatus>("idle");
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [activeGame, setActiveGame] = useState<GameSession | null>(null);
  const [history, setHistory] = useState(defaultHistory);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [buyRequiredStake, setBuyRequiredStake] = useState<number | null>(null);
  const [txModal, setTxModal] = useState<TransactionRecord | null>(null);
  const [insufficientModal, setInsufficientModal] = useState({
    open: false,
    required: 0,
    balance: 0,
  });

  const refreshBalance = useCallback(async () => {
    setBalanceLoading(true);
    try {
      const b = await mockTokenService.getBalance();
      setBalance(b);
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  useEffect(() => {
    const w = mockWalletService.getWallet();
    setWallet(w);
    void refreshBalance();
    try {
      const stake = sessionStorage.getItem(STAKE_INTENT_KEY);
      if (stake) setStakeIntentState(Number(stake));
      const ret = sessionStorage.getItem(RETURN_PATH_KEY);
      if (ret) setReturnPathState(ret);
    } catch {
      /* ignore */
    }
  }, [refreshBalance]);

  const setStakeIntent = useCallback((stake: number | null) => {
    setStakeIntentState(stake);
    if (typeof window !== "undefined") {
      if (stake != null) sessionStorage.setItem(STAKE_INTENT_KEY, String(stake));
      else sessionStorage.removeItem(STAKE_INTENT_KEY);
    }
  }, []);

  const setReturnPathAfterBuy = useCallback((path: string | null) => {
    setReturnPathState(path);
    if (typeof window !== "undefined") {
      if (path) sessionStorage.setItem(RETURN_PATH_KEY, path);
      else sessionStorage.removeItem(RETURN_PATH_KEY);
    }
  }, []);

  const pushToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  const connectWallet = useCallback(
    async (opts?: { simulateWrongNetwork?: boolean }) => {
      setWalletPhase("connecting");
      try {
        const w = await mockWalletService.connect(opts?.simulateWrongNetwork);
        setWallet(w);
        if (isWrongNetwork(w)) {
          setWalletPhase("wrong_network");
        } else {
          setWalletPhase("connected");
          pushToast("Wallet connected");
          await refreshBalance();
        }
      } catch {
        setWalletPhase("failed");
      }
    },
    [pushToast, refreshBalance],
  );

  const disconnectWallet = useCallback(async () => {
    await mockWalletService.disconnect();
    setWallet(null);
    setWalletPhase("idle");
    pushToast("Wallet disconnected", "info");
  }, [pushToast]);

  const switchNetwork = useCallback(async () => {
    setWalletPhase("connecting");
    const w = await mockWalletService.switchNetwork();
    setWallet(w);
    setWalletPhase("connected");
    pushToast("Network switched");
    await refreshBalance();
  }, [pushToast, refreshBalance]);

  const openConnectModal = () => setConnectModalOpen(true);
  const closeConnectModal = () => {
    setConnectModalOpen(false);
    if (walletPhase === "connected" || walletPhase === "wrong_network") return;
    setWalletPhase("idle");
  };

  const openBuyModal = (opts?: { returnPath?: string; requiredStake?: number }) => {
    if (opts?.returnPath) setReturnPathAfterBuy(opts.returnPath);
    if (opts?.requiredStake != null) setBuyRequiredStake(opts.requiredStake);
    setBuyModalOpen(true);
  };

  const closeBuyModal = () => {
    setBuyModalOpen(false);
    setBuyRequiredStake(null);
  };

  const getQuote = (amount: number) => mockTokenService.getQuote(amount);

  const runPurchase = async (quote: RpsQuote) => {
    const record = await mockTransactionService.runPurchase(quote, (step) => {
      setTxModal((prev) =>
        prev
          ? { ...prev, step }
          : {
              id: "pending",
              kind: "buy_rps",
              step,
              title: "PURCHASING RPS",
            },
      );
    });
    setTxModal(record);
    if (record.step === "success") {
      await refreshBalance();
      pushToast("RPS purchased");
    }
    return record;
  };

  const ensureFunds = (stake: number) => {
    const bal = getBalanceSync();
    if (bal.rps < stake) {
      setInsufficientModal({ open: true, required: stake, balance: bal.rps });
      return false;
    }
    return true;
  };

  const findQuickMatch = async (stake: number) => {
    if (!wallet?.connected || isWrongNetwork(wallet)) {
      openConnectModal();
      return;
    }
    if (!ensureFunds(stake)) {
      setStakeIntent(stake);
      return;
    }
    setStakeIntent(stake);
    setMatchStatus("searching");
    try {
      reserveStake(stake);
      await refreshBalance();
      const { room, game } = await mockMatchService.findOpponent(stake, wallet.address);
      setActiveRoom(room);
      setActiveGame(game);
      setRoomGameId(room.id, game.id);
      setMatchStatus("found");
      pushToast("Opponent found");
    } catch (e) {
      releaseStakeSafe(stake);
      await refreshBalance();
      setMatchStatus("failed");
      pushToast(e instanceof Error && e.message === "MATCH_CANCELLED" ? "Match cancelled" : "No opponent found", "error");
    }
  };

  const releaseStakeSafe = (stake: number) => {
    try {
      releaseStake(stake);
    } catch {
      /* ignore */
    }
  };

  const cancelMatchmaking = () => {
    mockMatchService.cancelMatch();
    setMatchStatus("cancelled");
    setMatchStatus("idle");
  };

  const createRoom = async (stake: number, visibility: Room["visibility"]) => {
    if (!wallet) throw new Error("Not connected");
    if (!ensureFunds(stake)) {
      setStakeIntent(stake);
      throw new Error("INSUFFICIENT");
    }
    reserveStake(stake);
    await refreshBalance();
    const room = await mockRoomService.createRoom(stake, visibility, wallet.address);
    setActiveRoom(room);
    setStakeIntent(stake);
    pushToast("Room created");
    void simulateOpponentJoin(room.id).then((r) => {
      if (r) {
        setActiveRoom(r);
        pushToast("Opponent joined");
      }
    });
    return room;
  };

  const joinRoom = async (roomId: string) => {
    if (!wallet) throw new Error("Not connected");
    const room = await mockRoomService.getRoom(roomId);
    if (!room) throw new Error("ROOM_UNAVAILABLE");
    if (!ensureFunds(room.stake)) {
      setStakeIntent(room.stake);
      throw new Error("INSUFFICIENT");
    }
    reserveStake(room.stake);
    await refreshBalance();
    const joined = await mockRoomService.joinRoom(roomId, wallet.address);
    setActiveRoom(joined);
    setStakeIntent(joined.stake);
    pushToast("Joined room");
    return joined;
  };

  const pollRoom = async (roomId: string) => {
    const room = await mockRoomService.getRoom(roomId);
    if (room) setActiveRoom(room);
    return room;
  };

  const setPlayerReady = async (roomId: string) => {
    if (!wallet) return;
    await mockRoomService.setReady(roomId, wallet.address, true);
    let room = getRoomSync(roomId);
    if (room) setActiveRoom(room);
    const opponent = room?.players.find((p) => p.address !== wallet.address);
    if (opponent) {
      setTimeout(async () => {
        await mockRoomService.setReady(roomId, opponent.address, true);
        room = getRoomSync(roomId);
        if (room) setActiveRoom(room);
      }, 1200);
    }
  };

  const startGameFromRoom = (room: Room) => {
    if (!wallet) throw new Error("Not connected");
    const game = mockGameService.createFromRoom(room, wallet.address);
    setActiveGame(game);
    setRoomGameId(room.id, game.id);
    return game;
  };

  const syncGame = (gameId: string) => {
    const ticked = mockGameService.tick(gameId);
    const g = ticked ?? mockGameService.getGame(gameId);
    if (g) setActiveGame(g);
    return g;
  };

  const markGameReady = async (gameId: string) => {
    if (!wallet) throw new Error("Not connected");
    const g = await mockGameService.markReady(gameId, wallet.address);
    setActiveGame(g);
    return g;
  };

  const submitMove = async (gameId: string, move: import("@/types/game").Move) => {
    if (!wallet) throw new Error("Not connected");
    const g = await mockGameService.chooseMove(gameId, wallet.address, move);
    setActiveGame(g);
    pushToast("Move submitted");
    return g;
  };

  const finalizeGameResult = (game: GameSession) => {
    if (!game.result || !wallet) return;
    const { outcome, payoutRps, breakdown } = game.result;
    if (outcome === "win") {
      applyGamePayout(payoutRps);
    } else if (outcome === "draw") {
      applyGamePayout(game.stake);
    }
    void refreshBalance();

    const entry: MockHistoryEntry = {
      id: game.id,
      outcome,
      stake: game.stake,
      payout: outcome === "win" ? breakdown.winnerPayout : outcome === "lose" ? -game.stake : 0,
      opponent: game.opponent.address,
      yourMove: game.result.yourMove,
      opponentMove: game.result.opponentMove,
      playedAt: new Date().toISOString(),
    };
    setHistory((h) => [entry, ...h]);
    setStakeIntent(game.stake);
  };

  const showInsufficient = (required: number) => {
    setInsufficientModal({
      open: true,
      required,
      balance: getBalanceSync().rps,
    });
  };

  const hideInsufficient = () =>
    setInsufficientModal({ open: false, required: 0, balance: 0 });

  // eslint-disable-next-line react-hooks/exhaustive-deps -- stable callbacks cover service surface
  const value = useMemo<AppContextValue>(
    () => ({
      wallet,
      walletPhase,
      balance,
      balanceLoading,
      stakeIntent,
      returnPathAfterBuy,
      matchStatus,
      activeRoom,
      activeGame,
      history,
      profile: profileStats,
      toasts,
      connectWallet,
      disconnectWallet,
      switchNetwork,
      refreshBalance,
      setStakeIntent,
      setReturnPathAfterBuy,
      openConnectModal,
      closeConnectModal,
      connectModalOpen,
      buyModalOpen,
      openBuyModal,
      closeBuyModal,
      buyRequiredStake,
      getQuote,
      runPurchase,
      txModal,
      setTxModal,
      pushToast,
      findQuickMatch,
      cancelMatchmaking,
      createRoom,
      joinRoom,
      pollRoom,
      setPlayerReady,
      startGameFromRoom,
      syncGame,
      markGameReady,
      submitMove,
      finalizeGameResult,
      insufficientModal,
      showInsufficient,
      hideInsufficient,
      requiredNetwork: REQUIRED_NETWORK,
    }),
    [
      wallet,
      walletPhase,
      balance,
      balanceLoading,
      stakeIntent,
      returnPathAfterBuy,
      matchStatus,
      activeRoom,
      activeGame,
      history,
      toasts,
      connectWallet,
      disconnectWallet,
      switchNetwork,
      refreshBalance,
      setStakeIntent,
      setReturnPathAfterBuy,
      connectModalOpen,
      buyModalOpen,
      buyRequiredStake,
      txModal,
      insufficientModal,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
