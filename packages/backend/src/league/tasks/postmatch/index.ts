import { Constants } from "twisted";
import configuration from "../../../configuration.js";
import _ from "lodash";
import { MatchV5DTOs } from "twisted/dist/models-dto/index.js";
import client from "../../../discord/client.js";
import { z } from "zod";
import { api } from "../../league/api.js";
import { GameState, getState, writeState } from "../../model/state.js";
import { AttachmentBuilder, EmbedBuilder, userMention } from "discord.js";
import { createMatchObject } from "./image/match.js";
import { matchToImage } from "./image/html/index.js";
import { generateMessageFromBrian } from "./feedback/index.js";
import { rankToLeaguePoints } from "../../model/leaguePoints.js";
import { indexToRanking } from "../../model/relativeRanking.js";
import { parseLane } from "../../model/lane.js";
import { getCurrentRank } from "../../model/playerConfigEntry.js";
import { mkdir, writeFile } from "fs/promises";

export async function checkPostMatch() {
  const [state, release] = await getState();

  console.log("checking match api");

  const games = await Promise.all(
    _.map(state.gamesStarted, async (game): Promise<[GameState, MatchV5DTOs.MatchDto | undefined]> => {
      try {
        const response = await api.MatchV5.get(`NA1_${game.matchId}`, Constants.RegionGroups.AMERICAS);
        return [game, response.response];
      } catch (e) {
        const result = z.object({ status: z.number() }).safeParse(e);
        if (result.success) {
          if (result.data.status == 404) {
            // game not done
            return [game, undefined];
          }
        }
        console.error(e);
        return [game, undefined];
      }
    }),
  );

  console.log("removing games in progress");

  // remove unfinished games
  const finishedGames = _.filter(games, ([_state, game]) => game != undefined) as [GameState, MatchV5DTOs.MatchDto][];

  console.log("sending messages");

  await Promise.all(
    _.map(finishedGames, async ([state, match]) => {
      await mkdir("matches");
      await writeFile(`matches/${match.info.gameId}`, JSON.stringify(match));

      const player = _.chain(match.info.participants)
        .filter((participant) => participant.puuid === state.player.league.leagueAccount.puuid)
        .first()
        .value();

      if (player == undefined) {
        console.error("invalid state");
        return;
      }

      const damageRank = _.findIndex(
        _.reverse(
          _.sortBy(
            _.filter(match.info.participants, (participant) => participant.teamId === player.teamId),
            (participant) => participant.totalDamageDealtToChampions,
          ),
        ),
        (participant) => participant.puuid === state.player.league.leagueAccount.puuid,
      );

      const currentRank = await getCurrentRank(state.player);
      const lpChange = rankToLeaguePoints(currentRank) - rankToLeaguePoints(state.rank);

      const minutes = _.round(match.info.gameDuration / 60);
      const damageString = `DAMAGE CHARTS: ${indexToRanking(damageRank)} place (${_.round(
        player.totalDamageDealtToChampions / 1000,
      )}K damage) `;
      const vsString = `${player.visionScore} vision score (${_.round(player.visionScore / minutes, 2)}/min)`;
      const totalCs = player.totalMinionsKilled + player.neutralMinionsKilled;
      const csString = `${totalCs} CS (${_.round(totalCs / minutes, 1)}/min)`;
      const kdaString = `KDA: ${player.kills}/${player.deaths}/${player.assists}`;

      let lpString;
      if (lpChange <= 0) {
        lpString = `${lpChange} LP (${lpChange / minutes / 60}/sec)`;
      } else {
        lpString = `+${lpChange} LP (${lpChange / minutes / 60}/sec)`;
      }

      let outcomeString: string;

      if (!player.win && player.gameEndedInSurrender) {
        outcomeString = "surrendered";
      } else if (player.win) {
        outcomeString = "won";
      } else {
        outcomeString = "lost";
      }

      // TODO: send duo queue message

      const user = await client.users.fetch(state.player.discordAccount.id, { cache: true });
      const promptMessage = `${userMention(user.id)} ${outcomeString} a ${minutes} minute game playing ${
        player.championName
      } ${parseLane(player.teamPosition)}\n${kdaString}\n${damageString}\n${vsString}\n${csString}\n${lpString}`;

      let discordMessage = `${parseLane(player.teamPosition)}
DAMAGE CHARTS: ${indexToRanking(damageRank)} place
${lpString}`;

      try {
        const { name, message } = await generateMessageFromBrian(promptMessage);
        discordMessage = `${name} says: ${message.replaceAll("<NAME>", userMention(user.id))}\n\n${discordMessage}`;
      } catch (e) {
        console.error(e);
      }

      const channel = await client.channels.fetch(configuration.leagueChannelId);
      if (channel?.isTextBased()) {
        const matchObj = createMatchObject(user.username, state.player, match);
        const image = await matchToImage(matchObj);

        const attachment = new AttachmentBuilder(image).setName("match.png");
        const embed = new EmbedBuilder().setImage(`attachment://${attachment.name}`);
        await channel.send({ content: discordMessage, embeds: [embed], files: [attachment] });
      } else {
        throw new Error("not text based");
      }
    }),
  );

  console.log("saving state files");

  const newMatches = _.differenceBy(
    state.gamesStarted,
    _.map(finishedGames, (game) => game[0]),
    (state) => state.uuid,
  );

  await writeState({
    ...state,
    gamesStarted: newMatches,
  });
  await release();
}
