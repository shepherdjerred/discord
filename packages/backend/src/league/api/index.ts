import {
  CurrentGameInfoDTO,
  CurrentGameParticipantDTO,
  SpectatorNotAvailableDTO,
} from "https://esm.sh/twisted@1.55.0/dist/models-dto/index.js";
import { z } from "https://esm.sh/zod@3.22.4";
import { PlayerConfigEntry } from "@glitter-boys/data";
import { api } from "./api.ts";
import { Constants } from "https://esm.sh/twisted@1.55.0";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash@4.17.21";

export const currentPatch = "13.22.1";
export const soloQueueConfigId = 420;

export async function getCurrentSoloQueueGame(
  player: PlayerConfigEntry
): Promise<undefined | CurrentGameInfoDTO> {
  try {
    const response = await api.Spectator.activeGame(
      player.league.leagueAccount.id,
      Constants.Regions.AMERICA_NORTH
    );
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
  participants: CurrentGameParticipantDTO[]
): CurrentGameParticipantDTO | undefined {
  return _.chain(participants)
    .filter(
      (participant) => participant.summonerId === player.league.leagueAccount.id
    )
    .first()
    .value();
}
