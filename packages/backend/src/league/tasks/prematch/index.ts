import { CurrentGameInfoDTO } from "twisted/dist/models-dto/index.js";
import { GameState, getPlayersNotInGame, getState, writeState } from "../../model/state.js";
import _ from "lodash";
import * as uuid from "uuid";
import { getPlayerConfigs } from "../../model/playerConfig.js";
import { PlayerConfigEntry, getCurrentRank } from "../../model/playerConfigEntry.js";
import { getCurrentSoloQueueGame } from "../../api/index.js";
import { createDiscordMessage } from "./discord.js";
import { send } from "../../discord/channel.js";

export async function checkPreMatch() {
  const players = await getPlayerConfigs();
  let [state, release] = await getState();
  await release();

  console.log("filtering out players in game");
  const playersNotInGame = getPlayersNotInGame(players, state);

  console.log("calling spectator API");
  const playerStatus = await Promise.all(_.map(playersNotInGame, getCurrentSoloQueueGame));

  console.log("filtering players not in game");
  const playersInGame = _.chain(playersNotInGame)
    .zip(playerStatus)
    .filter(([_player, game]) => game != undefined)
    .value() as [PlayerConfigEntry, CurrentGameInfoDTO][];

  // TODO: prune any old games
  console.log("removing games already seen");
  const newGames = _.reject(playersInGame, ([_player, game]) =>
    _.chain(state.gamesStarted)
      .map((game) => game.matchId)
      .some((candidate) => candidate === game.gameId)
      .value(),
  );

  console.log("sending messages");
  await Promise.all(_.chain(newGames).map(createDiscordMessage).map(send).value());

  console.log("creating new state entries");
  const newStateEntries = await Promise.all(
    _.map(newGames, async ([player, game]): Promise<GameState> => {
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

  console.log("saving state");
  [state, release] = await getState();
  await writeState({
    ...state,
    gamesStarted: _.concat(state.gamesStarted, newStateEntries),
  });
  await release();
}
