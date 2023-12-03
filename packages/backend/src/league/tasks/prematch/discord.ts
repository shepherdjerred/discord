import _ from "lodash";
import { getChampionName } from "twisted/dist/constants/champions.js";
import { CurrentGameInfoDTO } from "twisted/dist/models-dto/index.js";
import { findParticipant } from "../../api/index.js";
import { PlayerConfigEntry } from "@glitter-boys/data";

export function createDiscordMessage([player, game]: [PlayerConfigEntry, CurrentGameInfoDTO]): string {
  const participant = findParticipant(player, game.participants);

  if (participant === undefined) {
    throw new Error(`unable to find participant ${JSON.stringify(player)}, ${JSON.stringify(game)}`);
  }

  // TODO: call API to get proper champion name
  const championName = getChampionName(participant.championId);

  return `${player.name} started a solo queue game as ${_.startCase(championName.replaceAll("_", " ").toLowerCase())}`;
}
