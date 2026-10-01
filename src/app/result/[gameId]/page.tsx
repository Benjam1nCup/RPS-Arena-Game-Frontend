"use client";

import { ResultView } from "@/components/result/ResultView";
import { useApp } from "@/context/AppProvider";
import { getBalanceSync } from "@/services/mockTokenService";
import { useParams, useRouter } from "next/navigation";

export default function ResultPage() {
  const params = useParams<{ gameId: string }>();
  const gameId = params.gameId;
  const router = useRouter();
  const { activeGame, findQuickMatch, stakeIntent, showInsufficient, setStakeIntent } =
    useApp();

  const game = activeGame?.id === gameId ? activeGame : null;

  if (!game?.result) {
    return <p className="text-center text-text-secondary">Loading result…</p>;
  }

  const onPlayAgain = () => {
    const stake = stakeIntent ?? game.stake;
    setStakeIntent(stake);
    const bal = getBalanceSync().rps;
    if (bal < stake) {
      showInsufficient(stake);
      return;
    }
    void findQuickMatch(stake);
    router.push("/lobby");
  };

  return (
    <ResultView result={game.result} stake={game.stake} onPlayAgain={onPlayAgain} />
  );
}
