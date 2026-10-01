"use client";

import { PlayerCard } from "@/components/game/PlayerCard";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Spinner } from "@/components/common/Spinner";
import { useApp } from "@/context/AppProvider";
import { formatRps } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function RoomPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const router = useRouter();
  const {
    wallet,
    pollRoom,
    activeRoom,
    setPlayerReady,
    startGameFromRoom,
    pushToast,
  } = useApp();
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [youReady, setYouReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);

  const refresh = useCallback(async () => {
    const room = await pollRoom(roomId);
    if (!room || room.status === "closed") {
      setUnavailable(true);
    }
    setLoading(false);
  }, [pollRoom, roomId]);

  useEffect(() => {
    void refresh();
    const t = setInterval(() => void refresh(), 2500);
    return () => clearInterval(t);
  }, [refresh]);

  const room = activeRoom?.id === roomId ? activeRoom : null;

  const copyInvite = async () => {
    const url = `${window.location.origin}/room/${roomId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    pushToast("Invite link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const onReady = async () => {
    await setPlayerReady(roomId);
    setYouReady(true);
  };

  useEffect(() => {
    if (!room || room.players.length < 2) return;
    const ready =
      youReady && room.players.filter((p) => p.address !== wallet?.address).every((p) => p.ready);
    if (youReady && ready && !starting) {
      setStarting(true);
      const timer = setTimeout(() => {
        const game = startGameFromRoom(room);
        router.push(`/game/${game.id}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [room, youReady, wallet, starting, startGameFromRoom, router]);

  if (loading && !room) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (unavailable) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <h1 className="text-xl font-bold">Room unavailable</h1>
        <p className="mt-2 text-text-secondary">This room is no longer available.</p>
        <Link href="/lobby" className="mt-6 inline-block">
          <Button>Return to lobby</Button>
        </Link>
      </Card>
    );
  }

  if (!room) {
    return <p className="text-text-secondary">Loading room…</p>;
  }

  const opponent = room.players.find((p) => p.address !== wallet?.address);
  const waitingForOpponent = room.players.length < 2;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Room #{room.id}</h1>
        <p className="mt-2 text-lg text-primary">{formatRps(room.stake)} RPS stake</p>
      </div>

      {waitingForOpponent ? (
        <Card className="text-center">
          <p className="text-text-secondary">Waiting for opponent…</p>
          <p className="mt-2 text-sm text-text-muted">
            Players {room.players.length} / 2
          </p>
          <div className="mt-4 flex justify-center gap-1">
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-primary" />
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-primary [animation-delay:200ms]" />
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-primary [animation-delay:400ms]" />
          </div>
          <Button className="mt-6" variant="secondary" onClick={() => void copyInvite()}>
            {copied ? "✓ Invite link copied" : "Copy invite link"}
          </Button>
          <Link href="/lobby" className="mt-3 block">
            <Button variant="destructive" fullWidth>
              Cancel
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-center gap-8">
            <PlayerCard
              label="You"
              address={wallet?.address ?? room.players[0]!.address}
              stake={room.stake}
              status={youReady ? "✓ Ready" : undefined}
            />
            <span className="text-xl font-bold text-text-muted">VS</span>
            <PlayerCard
              label="Opponent"
              address={opponent?.address ?? "…"}
              stake={room.stake}
              status={opponent?.ready ? "✓ Ready" : "Waiting…"}
            />
          </div>

          {!youReady ? (
            <Card className="text-center">
              <p className="font-semibold">Both players connected</p>
              <p className="mt-1 text-sm text-text-secondary">Get ready to play.</p>
              <Button className="mt-4" onClick={() => void onReady()}>
                Ready
              </Button>
            </Card>
          ) : starting ? (
            <Card className="text-center">
              <p className="font-semibold text-primary">Match starting…</p>
              <Spinner className="mx-auto mt-4" />
            </Card>
          ) : (
            <Card className="text-center text-text-secondary">
              <p>You — ✓ Ready</p>
              <p className="mt-2">Opponent — {opponent?.ready ? "✓ Ready" : "Waiting…"}</p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
