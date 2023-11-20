import { Constants } from "twisted";
import configuration from "../../../configuration.js";
import _ from "lodash";
import { MatchV5DTOs } from "twisted/dist/models-dto/index.js";
import client from "../../../discord/client.js";
import { z } from "zod";
import { api } from "../../league/api.js";
import { GameState, getState, writeState } from "../../model/state.js";
import { AttachmentBuilder, EmbedBuilder, bold, userMention } from "discord.js";
import { matchToImage } from "./image/html/index.js";
import { generateFeedbackMessage } from "./feedback/index.js";
import { rankToLeaguePoints } from "../../model/leaguePoints.js";
import { getCurrentRank } from "../../model/playerConfigEntry.js";
import { mkdir, writeFile } from "fs/promises";
import { getPlayer } from "../../model/player.js";
import { createMatchObject } from "../../model/match.js";

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
      try {
        await mkdir("matches");
      } catch (e) {
        // noop
      }
      await writeFile(`matches/${match.info.gameId}`, JSON.stringify(match));

      const player = _.chain(match.info.participants)
        .filter((participant) => participant.puuid === state.player.league.leagueAccount.puuid)
        .first()
        .value();

      if (player == undefined) {
        console.error("invalid state");
        return;
      }

      const currentRank = await getCurrentRank(state.player);
      const lpChange = rankToLeaguePoints(currentRank) - rankToLeaguePoints(state.rank);

      // TODO: send duo queue message

      let discordMessage = "";
      const fullPlayer = await getPlayer(state.player);
      const matchObj = createMatchObject(fullPlayer, match, lpChange);

      try {
        const { name, message } = await generateFeedbackMessage(matchObj);
        discordMessage = `${bold("AI " + name)} says: ${message.replace(
          state.player.name,
          userMention(state.player.discordAccount.id),
        )}`;
        [
          client.emojis.
        ]
      } catch (e) {
        console.error(e);
      }

      const channel = await client.channels.fetch(configuration.leagueChannelId);
      if (channel?.isTextBased()) {
        const image = await matchToImage(matchObj);

        const attachment = new AttachmentBuilder(image).setName("match.png");
        const embed = new EmbedBuilder().setImage(`attachment://${attachment.name}`);
        await channel.send({ content: discordMessage, embeds: [embed], files: [attachment] });
      } else {
        throw new Error("channel is not text based");
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
