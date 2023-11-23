import { CurrentGameInfoDTO } from "twisted/dist/models-dto/index.js";
import _ from "lodash";
import * as uuid from "uuid";
import { PlayerConfigEntry, getPlayersNotInGame } from "@glitter-boys/data";
import { getCurrentSoloQueueGame } from "../../api/index.js";
import { createDiscordMessage } from "./discord.js";
import { send } from "../../discord/channel.js";
import { getCurrentRank } from "../../rank.js";
import { getPlayerConfigs } from "../../playerConfig.js";
import { getState, writeState } from "../../state.js";

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
  await Promise.all(
    _.chain(newGames)
      .map(async ([player, game]) => {
        const message = createDiscordMessage([player, game]);
        await send(message);

        const currentRank = await getCurrentRank(player);

        console.log("creating new state entries");
        const entry = {
          added: new Date(game.gameStartTime),
          matchId: game.gameId,
          uuid: uuid.v4(),
          player,
          rank: currentRank,
        };

        console.log("saving state");
        [state, release] = await getState();
        await writeState({
          ...state,
          gamesStarted: _.concat(state.gamesStarted, entry),
        });
        await release();
      })
      .value(),
  );
}
