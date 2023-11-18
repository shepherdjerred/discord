import { CurrentGameInfoDTO, SpectatorNotAvailableDTO } from "twisted/dist/models-dto/index.js";
import { z } from "zod";
import { PlayerConfigEntry } from "../model/playerConfigEntry.js";
import { api } from "./api.js";
import { Constants } from "twisted";

export const soloQueueConfigId = 420;

export async function getCurrentSoloQueueGame(player: PlayerConfigEntry): Promise<undefined | CurrentGameInfoDTO> {
  try {
    const response = await api.Spectator.activeGame(player.league.leagueAccount.id, Constants.Regions.AMERICA_NORTH);
    if (response instanceof SpectatorNotAvailableDTO) {
      return undefined;
    }
    if (response.response.gameQueueConfigId === soloQueueConfigId) {
      return response.response;
    }
  } catch (e) {
    const result = z.object({ status: z.number() }).safeParse(e);
    if (result.success) {
      if (result.data.status == 404) {
        // not in game
        return undefined;
      }
    }
    throw e;
  }
  return undefined;
}
