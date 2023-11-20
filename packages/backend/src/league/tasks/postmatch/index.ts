import { Constants } from "twisted";
import _ from "lodash";
import { MatchV5DTOs } from "twisted/dist/models-dto/index.js";
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
import { Match, createMatchObject } from "../../model/match.js";
import { send } from "../../discord/channel.js";

async function checkMatch(game: GameState) {
  try {
    const response = await api.MatchV5.get(`NA1_${game.matchId}`, Constants.RegionGroups.AMERICAS);
    return response.response;
  } catch (e) {
    const result = z.object({ status: z.number() }).safeParse(e);
    if (result.success) {
      if (result.data.status == 404) {
        // game not done
        return undefined;
      }
    }
    console.error(e);
    return undefined;
  }
}

async function saveMatch(match: MatchV5DTOs.MatchDto) {
  try {
    await mkdir("matches");
  } catch (e) {
    // noop
  }
  await writeFile(`matches/${match.info.gameId}`, JSON.stringify(match));
}

async function getImage(match: Match): Promise<[AttachmentBuilder, EmbedBuilder]> {
  const image = await matchToImage(match);
  const attachment = new AttachmentBuilder(image).setName("match.png");
  const embed = new EmbedBuilder().setImage(`attachment://${attachment.name}`);
  return [attachment, embed];
}

async function getAiMessage(match: Match) {
  const { name, message } = await generateFeedbackMessage(match);
  return `${bold("AI " + name)} says: ${message.replace(
    match.player.playerConfig.name,
    userMention(match.player.playerConfig.discordAccount.id),
  )}`;
}

async function createMatchObj(state: GameState, match: MatchV5DTOs.MatchDto) {
  const player = _.chain(match.info.participants)
    .filter((participant) => participant.puuid === state.player.league.leagueAccount.puuid)
    .first()
    .value();

  if (player == undefined) {
    throw new Error(`unable to find player ${JSON.stringify(state)}, ${JSON.stringify(match)}`);
  }

  const currentRank = await getCurrentRank(state.player);
  const lpChange = rankToLeaguePoints(currentRank) - rankToLeaguePoints(state.rank);

  const fullPlayer = await getPlayer(state.player);
  return createMatchObject(fullPlayer, match, lpChange);
}

export async function checkPostMatch() {
  let [state, release] = await getState();
  await release();

  console.log("checking match api");
  const games = await Promise.all(_.map(state.gamesStarted, checkMatch));

  console.log("removing games in progress");
  const finishedGames = _.chain(state.gamesStarted)
    .zip(games)
    .filter(([_game, match]) => match != undefined)
    .value() as [GameState, MatchV5DTOs.MatchDto][];

  // TODO: send duo queue message
  console.log("sending messages");
  await Promise.all(
    _.map(finishedGames, async ([state, match]) => {
      await saveMatch(match);

      const matchObj = await createMatchObj(state, match);
      const discordMessage = await getAiMessage(matchObj);
      const [attachment, embed] = await getImage(matchObj);
      await send({ content: discordMessage, embeds: [embed], files: [attachment] });
    }),
  );

  console.log("calculating new state");
  [state, release] = await getState();
  const newMatches = _.differenceBy(
    state.gamesStarted,
    _.map(finishedGames, (game) => game[0]),
    (state) => state.uuid,
  );

  console.log("saving state files");
  await writeState({
    ...state,
    gamesStarted: newMatches,
  });
  await release();
}
