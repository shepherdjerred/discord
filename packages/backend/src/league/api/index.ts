import {
  CurrentGameInfoDTO,
  CurrentGameParticipantDTO,
  SpectatorNotAvailableDTO,
} from "twisted/dist/models-dto/index.js";
import { z } from "zod";
import { PlayerConfigEntry } from "@glitter-boys/data";
import { api } from "./api.js";
import { Constants } from "twisted";
import _ from "lodash";

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

export function findParticipant(
  player: PlayerConfigEntry,
  participants: CurrentGameParticipantDTO[],
): CurrentGameParticipantDTO | undefined {
  return _.chain(participants)
    .filter((participant) => participant.summonerId === player.league.leagueAccount.id)
    .first()
    .value();
}
