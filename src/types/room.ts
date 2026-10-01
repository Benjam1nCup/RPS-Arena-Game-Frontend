export type RoomVisibility = "public" | "private";

export interface RoomPlayer {
  address: string;
  stake: number;
  ready: boolean;
}

export interface Room {
  id: string;
  stake: number;
  visibility: RoomVisibility;
  players: RoomPlayer[];
  status: "waiting" | "ready" | "starting" | "in_game" | "closed";
  gameId?: string;
  hostAddress: string;
}
