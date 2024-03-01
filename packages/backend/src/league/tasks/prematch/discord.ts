// @deno-types="npm:@types/lodash"
import _ from "npm:lodash@4.17.21";
import { getChampionName } from "npm:twisted@1.57.0/dist/constants/champions.js";
import { CurrentGameInfoDTO } from "npm:twisted@1.57.0/dist/models-dto/index.js";
import { findParticipant } from "../../api/index.ts";
import { PlayerConfigEntry } from "@glitter-boys/data";

export function createDiscordMessage([players, game]: [
  PlayerConfigEntry[],
  CurrentGameInfoDTO,
]): string {
  const participants = players.map((player) => {
    const participant = findParticipant(player, game.participants);
    if (participant === undefined) {
      throw new Error(
        `unable to find participants: ${JSON.stringify(participants)}, ${
          JSON.stringify(
            game,
          )
        }`,
      );
    }
    return { player, participant };
  });

  let type = "solo";
  if (participants.length === 2) {
    type = "duo";
  }

  // TODO: call API to get proper champion name
  const messages = _.map(participants, (participant) => {
    const championName = getChampionName(participant.participant.championId);
    return `${participant.player.name} started a ${type} queue game as ${
      _.startCase(
        championName.replaceAll("_", " ").toLowerCase(),
      )
    }`;
  });

  return messages.join("\n");
}
