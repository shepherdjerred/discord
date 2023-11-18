import { open } from "fs/promises";
import { CurrentGameInfoDTO, SpectatorNotAvailableDTO } from "twisted/dist/models-dto/index.js";
import { z } from "zod";
import configuration from "../configuration.js";
import client from "../discord/client.js";
import { api } from "./riotApi.js";
import { GameState, loadState, writeState } from "./model/state.js";
import _ from "lodash";
import { Constants } from "twisted";
import { roleMention, userMention } from "discord.js";
import * as uuid from "uuid";
import { getChampionName } from "twisted/dist/constants/champions.js";
import { P, match } from "ts-pattern";
import { PlayerConfigSchema } from "./model/playerConfig.js";
import { PlayerConfigEntry, getCurrentRank } from "./model/playerConfigEntry.js";

export async function checkPreMatch() {
  // loop over all tracked players
  const playersFile = await open("players.json");
  const playersJson = (await playersFile.readFile()).toString();
  await playersFile.close();
  const players = PlayerConfigSchema.parse(JSON.parse(playersJson));

  const [state, release] = await loadState();

  console.log("filtering out players in game");

  const playersNotInGame = _.reject(players, (player) =>
    _.some(
      state.gamesStarted,
      (game) => game.player.league.leagueAccount.accountId === player.league.leagueAccount.accountId,
    ),
  );

  console.log("calling spectator API");

  // call the spectator API on every player
  const playerStatus = await Promise.all(
    _.map(playersNotInGame, async (player): Promise<[PlayerConfigEntry, CurrentGameInfoDTO | undefined]> => {
      try {
        const response = await api.Spectator.activeGame(
          player.league.leagueAccount.id,
          Constants.Regions.AMERICA_NORTH,
        );
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
    PlayerConfigEntry,
    CurrentGameInfoDTO,
  ][];

  console.log("removing games already seen");

  // TODO: prune any old games

  // remove any games already in the state file
  const unseenGames = _.reject(playersInGame, ([_player, game]) =>
    _.some(
      _.map(state.gamesStarted, (game) => game.matchId),
      (candidate) => candidate === game.gameId,
    ),
  );

  console.log("sending messages");

  await Promise.all(
    _.map(unseenGames, async ([player, game]) => {
      const user = await client.users.fetch(player.discordAccount.id, { cache: true });

      const gamePlayer = _.first(
        _.filter(game.participants, (participant) => participant.summonerId === player.league.leagueAccount.id),
      );

      if (gamePlayer == undefined) {
        console.error("invalid state");
        return;
      }

      const message = match([player, game, getChampionName(gamePlayer.championId)])
        .returnType<string>()
        .with([P.any, P.any, "Senna"], () => {
          return `${roleMention("everyone")} ${userMention(user.id)} is playing Senna in solo queue,
          )}`;
        })
        .with([{ name: "Virmel" }, P.any, P.any], () => {
          return `${userMention(user.id)} Brian says good luck playing ${_.startCase(
            getChampionName(gamePlayer.championId).replaceAll("_", " ").toLowerCase(),
          )}!!!`;
        })
        .otherwise(() => {
          return `${userMention(user.id)} started a solo queue game as ${_.startCase(
            getChampionName(gamePlayer.championId).replaceAll("_", " ").toLowerCase(),
          )}`;
        });

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
