import { open, writeFile } from "fs/promises";
import { CurrentGameInfoDTO, SpectatorNotAvailableDTO } from "twisted/dist/models-dto/index.js";
import { z } from "zod";
import configuration from "../configuration.js";
import client from "../discord/client.js";
import { api } from "./api.js";
import { PlayersConfigSchema, type PlayerConfig } from "./model.js";
import { GameState, StateSchema } from "./state.js";
import _ from "lodash";
import { Constants } from "twisted";
import { userMention } from "discord.js";
import * as uuid from "uuid";
import { lock } from "proper-lockfile";
import { getChampionName } from "twisted/dist/constants/champions.js";

export async function checkSpectate() {
  const release = await lock("state.json");

  // loop over all tracked players
  const playersFile = await open("players.json");
  const playersJson = (await playersFile.readFile()).toString();
  await playersFile.close();
  const players = PlayersConfigSchema.parse(JSON.parse(playersJson));

  console.log("calling spectator API");

  // call the spectator API on every player
  const playerStatus = await Promise.all(
    _.flatMap(players, async (player): Promise<[PlayerConfig, CurrentGameInfoDTO | undefined]> => {
      try {
        const response = await api.Spectator.activeGame(player.league.id, Constants.Regions.AMERICA_NORTH);
        if (response instanceof SpectatorNotAvailableDTO) {
          return [player, undefined];
        }
        if (response.response.gameQueueConfigId === 420) {
          return [player, response.response];
        }
      } catch (e) {
        const result = z.object({ status: z.number() }).safeParse(e);
        if (result.success) {
          if (result.data.status == 404) {
            // not in game
            return [player, undefined];
          }
        }
        console.error(e);
      }
      return [player, undefined];
    }),
  );

  console.log("filtering players not in game");

  // remove players not in games
  const playersInGame = _.filter(playerStatus, ([_player, game]) => game != undefined) as [
    PlayerConfig,
    CurrentGameInfoDTO,
  ][];

  const stateFile = await open("state.json");
  const stateJson = (await stateFile.readFile()).toString();
  await stateFile.close();
  const state = StateSchema.parse(JSON.parse(stateJson));

  console.log("removing games already seen");

  // TODO: prune any old games

  // remove any games already in the state file
  const unseenGames = _.reject(playersInGame, ([_player, game]) =>
    _.some(
      _.map(state.gamesStarted, (game) => game.id),
      (candidate) => candidate === game.gameId,
    ),
  );

  console.log("sending messages");

  await Promise.all(
    _.map(unseenGames, async ([player, game]) => {
      const user = await client.users.fetch(player.discordId, { cache: true });

      const gamePlayer = _.first(
        _.filter(game.participants, (participant) => participant.summonerId === player.league.id),
      );

      if (gamePlayer == undefined) {
        console.error("invalid state");
        return;
      }

      // TODO: send duo message

      const message = `${userMention(user.id)} started a solo queue game as ${_.startCase(
        getChampionName(gamePlayer.championId).replaceAll("_", " ").toLowerCase(),
      )}`;

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
    _.map(unseenGames, ([player, game]): GameState => {
      return {
        date: new Date(game.gameStartTime),
        id: game.gameId,
        uuid: uuid.v4(),
        player,
      };
    }),
  );

  const entries = _.concat(state.gamesStarted, unseenEntries);

  await writeFile(
    "state.json",
    JSON.stringify({
      ...state,
      gamesStarted: entries,
    }),
  );
  await release();
}
