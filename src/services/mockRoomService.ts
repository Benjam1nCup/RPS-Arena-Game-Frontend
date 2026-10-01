import { initialPublicRooms } from "@/data/mockData";
import { MOCK_OPPONENT_ADDRESS } from "@/lib/constants";
import { delay, randomBetween } from "@/lib/utils";
import type { Room } from "@/types/room";
import type { RoomService } from "./interfaces";

let rooms: Room[] = initialPublicRooms.map((r) => ({
  ...r,
  players: r.players.map((p) => ({ ...p })),
}));
let nextRoomId = 1005;

function cloneRooms() {
  return rooms.map((r) => ({
    ...r,
    players: r.players.map((p) => ({ ...p })),
  }));
}

export const mockRoomService: RoomService = {
  async getRooms() {
    await delay(300);
    return cloneRooms().filter(
      (r) => r.visibility === "public" && r.status === "waiting" && r.players.length < 2,
    );
  },

  async getRoom(roomId: string) {
    await delay(200);
    const room = rooms.find((r) => r.id === roomId);
    return room ? { ...room, players: room.players.map((p) => ({ ...p })) } : null;
  },

  async createRoom(stake, visibility, host) {
    await delay(500);
    const id = String(nextRoomId++);
    const room: Room = {
      id,
      stake,
      visibility,
      hostAddress: host,
      status: "waiting",
      players: [{ address: host, stake, ready: false }],
    };
    rooms = [room, ...rooms];
    return { ...room, players: [...room.players] };
  },

  async joinRoom(roomId, player) {
    await delay(randomBetween(400, 900));
    const room = rooms.find((r) => r.id === roomId);
    if (!room || room.status === "closed" || room.players.length >= 2) {
      throw new Error("ROOM_UNAVAILABLE");
    }
    if (room.players.some((p) => p.address === player)) {
      return { ...room, players: room.players.map((p) => ({ ...p })) };
    }
    room.players.push({ address: player, stake: room.stake, ready: false });
    if (room.players.length === 2) room.status = "ready";
    return { ...room, players: room.players.map((p) => ({ ...p })) };
  },

  async leaveRoom(roomId, player) {
    await delay(300);
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;
    room.players = room.players.filter((p) => p.address !== player);
    if (room.players.length === 0) room.status = "closed";
    else room.status = "waiting";
  },

  async setReady(roomId, player, ready) {
    await delay(200);
    const room = rooms.find((r) => r.id === roomId);
    if (!room) throw new Error("Room not found");
    const p = room.players.find((x) => x.address === player);
    if (p) p.ready = ready;
    return { ...room, players: room.players.map((x) => ({ ...x })) };
  },
};

export async function simulateOpponentJoin(roomId: string) {
  await delay(randomBetween(2000, 5000));
  const room = rooms.find((r) => r.id === roomId);
  if (!room || room.players.length >= 2) return null;
  room.players.push({
    address: MOCK_OPPONENT_ADDRESS,
    stake: room.stake,
    ready: false,
  });
  room.status = "ready";
  return { ...room, players: room.players.map((p) => ({ ...p })) };
}

export function getRoomSync(roomId: string) {
  const room = rooms.find((r) => r.id === roomId);
  return room ? { ...room, players: room.players.map((p) => ({ ...p })) } : null;
}

export function setRoomGameId(roomId: string, gameId: string) {
  const room = rooms.find((r) => r.id === roomId);
  if (room) {
    room.gameId = gameId;
    room.status = "in_game";
  }
}
