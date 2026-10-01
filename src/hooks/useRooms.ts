"use client";

import { useApp } from "@/context/AppProvider";

export function useRooms() {
  const { activeRoom, createRoom, joinRoom, pollRoom } = useApp();
  return { activeRoom, createRoom, joinRoom, pollRoom };
}
