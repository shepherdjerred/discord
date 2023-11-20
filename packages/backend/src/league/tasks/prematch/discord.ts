import { userMention } from "discord.js";
import _ from "lodash";
import { getChampionName } from "twisted/dist/constants/champions.js";
import { CurrentGameInfoDTO } from "twisted/dist/models-dto/index.js";
import { findParticipant } from "../../league/index.js";
import { PlayerConfigEntry } from "../../model/playerConfigEntry.js";
export function createDiscordMessage([player, game]: [PlayerConfigEntry, CurrentGameInfoDTO]): string {
  const participant = findParticipant(player, game.participants);

  if (participant === undefined) {
    throw new Error(`unable to find participant ${JSON.stringify(player)}, ${JSON.stringify(game)}`);
  }

  const mention = userMention(player.discordAccount.id);
  // TODO: call API to get prope champion name
  const championName = getChampionName(participant.championId);

  return `${mention} started a solo queue game as ${_.startCase(championName.replaceAll("_", " ").toLowerCase())}`;
}
