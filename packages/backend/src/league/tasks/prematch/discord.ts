import { userMention } from "npm:discord.js@14.14.1";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash@4.17.21";
import { getChampionName } from "npm:twisted@1.55.0/dist/constants/champions.js";
import { CurrentGameInfoDTO } from "npm:twisted@1.55.0/dist/models-dto/index.js";
import { findParticipant } from "../../api/index.ts";
import { PlayerConfigEntry } from "@glitter-boys/data";
export function createDiscordMessage([player, game]: [
  PlayerConfigEntry,
  CurrentGameInfoDTO,
]): string {
  const participant = findParticipant(player, game.participants);

  if (participant === undefined) {
    throw new Error(
      `unable to find participant ${JSON.stringify(player)}, ${JSON.stringify(
        game,
      )}`,
    );
  }

  const mention = userMention(player.discordAccount.id);
  // TODO: call API to get prope champion name
  const championName = getChampionName(participant.championId);

  return `${mention} started a solo queue game as ${_.startCase(
    championName.replaceAll("_", " ").toLowerCase(),
  )}`;
}
