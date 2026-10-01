"use client";

import { BalanceDisplay } from "@/components/balance/BalanceDisplay";
import { StakeCard } from "@/components/balance/StakeCard";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { Spinner } from "@/components/common/Spinner";
import { STAKE_PRESETS } from "@/lib/constants";
import { calcPrizeBreakdown, formatRps } from "@/lib/utils";
import { useApp } from "@/context/AppProvider";
import { mockRoomService } from "@/services/mockRoomService";
import { isWrongNetwork } from "@/services/mockWalletService";
import type { Room } from "@/types/room";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function LobbyPage() {
  const router = useRouter();
  const {
    wallet,
    openConnectModal,
    findQuickMatch,
    matchStatus,
    activeRoom,
    cancelMatchmaking,
    createRoom,
    joinRoom,
    stakeIntent,
    setStakeIntent,
    balance,
    showInsufficient,
  } = useApp();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [quickOpen, setQuickOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedStake, setSelectedStake] = useState(stakeIntent ?? 100);
  const [customStake, setCustomStake] = useState("");
  const [roomVisibility, setRoomVisibility] = useState<Room["visibility"]>("public");
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);

  const stake = customStake ? Number(customStake) : selectedStake;
  const stakeValid = Number.isFinite(stake) && stake > 0;
  const breakdown = stakeValid ? calcPrizeBreakdown(stake) : null;

  const loadRooms = useCallback(async () => {
    setLoadingRooms(true);
    try {
      setRooms(await mockRoomService.getRooms());
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  useEffect(() => {
    if (stakeIntent) setSelectedStake(stakeIntent);
  }, [stakeIntent]);

  const requireWallet = () => {
    if (!wallet?.connected) {
      openConnectModal();
      return false;
    }
    if (isWrongNetwork(wallet)) {
      openConnectModal();
      return false;
    }
    return true;
  };

  const checkBalance = (amount: number) => {
    if (balance.rps < amount) {
      setStakeIntent(amount);
      showInsufficient(amount);
      return false;
    }
    return true;
  };

  const onQuickMatch = async () => {
    if (!requireWallet() || !stakeValid) return;
    if (!checkBalance(stake)) return;
    setQuickOpen(false);
    await findQuickMatch(stake);
  };

  useEffect(() => {
    if (matchStatus === "found" && activeRoom) {
      router.push(`/room/${activeRoom.id}`);
    }
  }, [matchStatus, activeRoom, router]);

  const onCreate = async () => {
    if (!requireWallet() || !stakeValid) return;
    if (!checkBalance(stake)) return;
    try {
      const room = await createRoom(stake, roomVisibility);
      setCreateOpen(false);
      setConfirmCreate(false);
      router.push(`/room/${room.id}`);
    } catch (e) {
      if (e instanceof Error && e.message === "INSUFFICIENT") return;
    }
  };

  const onJoin = async (roomId: string, roomStake: number) => {
    if (!requireWallet()) return;
    if (!checkBalance(roomStake)) return;
    setJoining(roomId);
    try {
      const room = await joinRoom(roomId);
      router.push(`/room/${room.id}`);
    } catch {
      /* insufficient handled */
    } finally {
      setJoining(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Play</h1>
        <p className="mt-2 text-text-secondary">Find an opponent and start a match.</p>
      </div>

      <Card className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-semibold">Quick match</p>
          <p className="text-sm text-text-secondary">Match instantly at your chosen stake.</p>
        </div>
        <Button onClick={() => setQuickOpen(true)}>Quick match</Button>
      </Card>

      <p className="text-center text-sm text-text-muted">OR</p>

      <Button variant="secondary" fullWidth onClick={() => setCreateOpen(true)}>
        Create room
      </Button>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-text-muted">
          Public rooms
        </h2>
        {loadingRooms ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : rooms.length === 0 ? (
          <Card className="text-center text-text-secondary">
            <p>No public rooms</p>
            <p className="mt-2 text-sm">Create a room or use quick match.</p>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-2xl border-2 border-black bg-white">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead className="bg-[#FFD445] text-black/70">
                <tr>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3">Stake</th>
                  <th className="px-4 py-3">Players</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id} className="border-t border-black/10">
                    <td className="px-4 py-3">#{r.id}</td>
                    <td className="px-4 py-3">{formatRps(r.stake)} RPS</td>
                    <td className="px-4 py-3">
                      {r.players.length} / 2
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="secondary"
                        className="py-2 text-xs"
                        disabled={joining === r.id}
                        onClick={() => void onJoin(r.id, r.stake)}
                      >
                        Join
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal open={quickOpen} onClose={() => setQuickOpen(false)} title="Quick match">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Choose your stake</p>
          <div className="grid grid-cols-2 gap-2">
            {STAKE_PRESETS.map((s) => (
              <StakeCard
                key={s}
                amount={s}
                selected={!customStake && selectedStake === s}
                onSelect={() => {
                  setCustomStake("");
                  setSelectedStake(s);
                }}
              />
            ))}
          </div>
          <Input
            label="Custom"
            inputMode="numeric"
            value={customStake}
            onChange={(e) => setCustomStake(e.target.value.replace(/[^\d]/g, ""))}
          />
          <BalanceDisplay compact />
          {breakdown ? (
            <div className="rounded-lg border border-border p-3 text-xs text-text-secondary">
              <p className="mb-2 font-semibold uppercase text-text-muted">Prize breakdown</p>
              <p>Winner receives {formatRps(breakdown.winnerPayout)} RPS</p>
              <p>Platform fee {formatRps(breakdown.platformFee)} RPS</p>
            </div>
          ) : null}
          <Button fullWidth disabled={!stakeValid} onClick={() => void onQuickMatch()}>
            Find opponent
          </Button>
        </div>
      </Modal>

      <Modal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setConfirmCreate(false);
        }}
        title="Create room"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {STAKE_PRESETS.map((s) => (
              <StakeCard
                key={s}
                amount={s}
                selected={!customStake && selectedStake === s}
                onSelect={() => {
                  setCustomStake("");
                  setSelectedStake(s);
                }}
              />
            ))}
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm text-text-secondary">Room type</legend>
            {(["public", "private"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 text-sm capitalize">
                <input
                  type="radio"
                  name="visibility"
                  checked={roomVisibility === v}
                  onChange={() => setRoomVisibility(v)}
                />
                {v}
              </label>
            ))}
          </fieldset>
          <p className="text-sm">
            Balance: <span className="font-semibold">{formatRps(balance.rps)} RPS</span>
          </p>
          {!confirmCreate ? (
            <Button fullWidth disabled={!stakeValid} onClick={() => setConfirmCreate(true)}>
              Create room
            </Button>
          ) : (
            <>
              {breakdown ? (
                <p className="text-sm text-text-secondary">
                  Potential prize {formatRps(breakdown.winnerPayout)} RPS · Fee{" "}
                  {formatRps(breakdown.platformFee)} RPS
                </p>
              ) : null}
              <Button fullWidth onClick={() => void onCreate()}>
                Confirm & create
              </Button>
            </>
          )}
        </div>
      </Modal>

      {matchStatus === "searching" ? (
        <Modal open onClose={cancelMatchmaking} title="Finding opponent">
          <div className="flex flex-col items-center gap-4 py-4">
            <Spinner className="h-10 w-10" />
            <p className="text-text-secondary">Finding opponent…</p>
            <Button variant="secondary" onClick={cancelMatchmaking}>
              Cancel
            </Button>
          </div>
        </Modal>
      ) : null}

      {matchStatus === "failed" ? (
        <Card className="border-danger/40 text-center">
          <p className="font-semibold text-danger">No opponent found</p>
          <Button className="mt-4" onClick={() => setQuickOpen(true)}>
            Try again
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
