import { userMention } from "https://esm.sh/discord.js";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";
import { getChampionName } from "twisted/dist/constants/champions.ts";
import { CurrentGameInfoDTO } from "twisted/dist/models-dto/index.ts";
import { findParticipant } from "../../api/index.ts";
import { PlayerConfigEntry } from "@glitter-boys/data";
export function createDiscordMessage([player, game]: [
  PlayerConfigEntry,
  CurrentGameInfoDTO
]): string {
  const participant = findParticipant(player, game.participants);

  if (participant === undefined) {
    throw new Error(
      `unable to find participant ${JSON.stringify(player)}, ${JSON.stringify(
        game
      )}`
    );
  }

  const mention = userMention(player.discordAccount.id);
  // TODO: call API to get prope champion name
  const championName = getChampionName(participant.championId);

  return `${mention} started a solo queue game as ${_.startCase(
    championName.replaceAll("_", " ").toLowerCase()
  )}`;
}
