import { userMention, roleMention } from "discord.js";
import _ from "lodash";
import { match, P } from "ts-pattern";
import { getChampionName } from "twisted/dist/constants/champions.js";
import { CurrentGameInfoDTO } from "twisted/dist/models-dto/index.js";
import { findParticipant } from "../../league/index.js";
import { PlayerConfigEntry } from "../../model/playerConfigEntry.js";

export function createDiscordMessage(player: PlayerConfigEntry, game: CurrentGameInfoDTO): string | undefined {
  const participant = findParticipant(player, game);

  if (participant === undefined) {
    return undefined;
  }

  const mention = userMention(player.discordAccount.id);
  const championName = getChampionName(participant.championId);

  return match([player, game, championName])
    .returnType<string>()
    .with([P.any, P.any, "Senna"], () => {
      return `${roleMention("everyone")} ${mention} is playing Senna in solo queue`;
    })
    .with([{ name: "Virmel" }, P.any, P.any], () => {
      return `${mention} Brian says good luck playing ${_.startCase(
        championName.replaceAll("_", " ").toLowerCase(),
      )}!!!`;
    })
    .otherwise(() => {
      return `${mention} started a solo queue game as ${_.startCase(championName.replaceAll("_", " ").toLowerCase())}`;
    });
}
