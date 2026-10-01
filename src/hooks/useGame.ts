"use client";

import { useApp } from "@/context/AppProvider";

export function useGame() {
  const {
    activeGame,
    syncGame,
    markGameReady,
    submitMove,
    finalizeGameResult,
    startGameFromRoom,
  } = useApp();
  return {
    activeGame,
    syncGame,
    markGameReady,
    submitMove,
    finalizeGameResult,
    startGameFromRoom,
  };
}
