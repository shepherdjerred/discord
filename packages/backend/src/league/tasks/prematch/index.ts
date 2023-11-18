import { CurrentGameInfoDTO } from "twisted/dist/models-dto/index.js";
import configuration from "../../../configuration.js";
import client from "../../../discord/client.js";
import { GameState, getPlayersNotInGame, getState, writeState } from "../../model/state.js";
import _ from "lodash";
import * as uuid from "uuid";
import { getPlayerConfigs } from "../../model/playerConfig.js";
import { PlayerConfigEntry, getCurrentRank } from "../../model/playerConfigEntry.js";
import { getCurrentSoloQueueGame } from "../../league/index.js";
import { createDiscordMessage } from "./discord.js";

export async function checkPreMatch() {
  const players = await getPlayerConfigs();
  const [state, release] = await getState();

  console.log("filtering out players in game");

  const playersNotInGame = getPlayersNotInGame(players, state);

  console.log("calling spectator API");

  // call the spectator API on every player
  const playerStatus = await Promise.all(_.map(playersNotInGame, getCurrentSoloQueueGame));

  console.log("filtering players not in game");

  // remove players not in games
  const playersInGame = _.chain(playersNotInGame)
    .zip(playerStatus)
    .filter(([_player, game]) => game != undefined)
    .value() as [PlayerConfigEntry, CurrentGameInfoDTO][];

  console.log("removing games already seen");

  // TODO: prune any old games

  // remove any games already in the state file
  const unseenGames = _.reject(playersInGame, ([_player, game]) =>
    _.chain(state.gamesStarted)
      .map((game) => game.matchId)
      .some((candidate) => candidate === game.gameId)
      .value(),
  );

  console.log("sending messages");

  await Promise.all(
    _.map(unseenGames, async ([player, game]) => {
      const message = createDiscordMessage(player, game);

      if (message === undefined) {
        throw new Error("unable to create message");
      }

      const channel = await client.channels.fetch(configuration.leagueChannelId);
      if (channel?.isTextBased()) {
        await channel.send(message);
      } else {
        throw new Error("not text based");
      }
    }),
  );

  console.log("saving state");

  const unseenEntries = await Promise.all(
    _.map(unseenGames, async ([player, game]): Promise<GameState> => {
      const currentRank = await getCurrentRank(player);

      return {
        added: new Date(game.gameStartTime),
        matchId: game.gameId,
        uuid: uuid.v4(),
        player,
        rank: currentRank,
      };
    }),
  );

  const entries = _.concat(state.gamesStarted, unseenEntries);

  await writeState({
    ...state,
    gamesStarted: entries,
  });
  await release();
}
