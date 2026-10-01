import { DELAYS, MOCK_OPPONENT_ADDRESS } from "@/lib/constants";
import { delay, randomBetween } from "@/lib/utils";
import type { MatchService } from "./interfaces";
import { mockGameService } from "./mockGameService";
import { mockRoomService } from "./mockRoomService";

let activeSearch: { cancelled: boolean } | null = null;

export const mockMatchService: MatchService = {
  async findOpponent(stake, player) {
    activeSearch = { cancelled: false };
    await delay(
      randomBetween(DELAYS.findOpponentMin, DELAYS.findOpponentMax),
    );
    if (activeSearch?.cancelled) {
      throw new Error("MATCH_CANCELLED");
    }

    const room = await mockRoomService.createRoom(stake, "public", player);
    await delay(randomBetween(800, 2000));
    if (activeSearch?.cancelled) throw new Error("MATCH_CANCELLED");

    await mockRoomService.joinRoom(room.id, MOCK_OPPONENT_ADDRESS);
    const updated = await mockRoomService.getRoom(room.id);
    if (!updated) throw new Error("Room lost");

    const game = mockGameService.createFromRoom(updated, player);
    activeSearch = null;
    return { room: updated, game };
  },

  cancelMatch() {
    if (activeSearch) activeSearch.cancelled = true;
    activeSearch = null;
  },
};
