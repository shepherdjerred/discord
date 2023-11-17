import { open } from "fs/promises";
import { Constants, LolApi } from "twisted";
import configuration from "../configuration.js";
import { PlayersConfigSchema, type PlayerConfig } from "./model.js";
import _ from "lodash";
// import { SpectatorNotAvailableDTO } from "twisted/dist/models-dto/index.js";
import client from "../discord/client.js";
// import { z } from "zod";
import async, { IterableCollection } from "async";

// loop over all tracked players
const file = await open("players.json");
const playersJson = (await file.readFile()).toString();
await file.close();

const players = PlayersConfigSchema.parse(JSON.parse(playersJson));

const api = new LolApi({
  key: configuration.riotApiToken,
  rateLimitRetry: true,
  rateLimitRetryAttempts: 3,
  concurrency: 1,
});

// check if the players have just entered a game
// const playersInGame = await async.filter(players, async (player) => {
//   try {
//     const response = await api.Spectator.activeGame(player.league.id, Constants.Regions.AMERICA_NORTH);
//     if (response instanceof SpectatorNotAvailableDTO) {
//       return false;
//     }
//     if (response.response.gameQueueConfigId === 420) {
//       return true;
//     }
//   } catch (e) {
//     const result = z.object({ status: z.number() }).safeParse(e);
//     if (result.success) {
//       if (result.data.status == 404) {
//         // not in game
//         return false;
//       }
//     }
//     console.error(e);
//   }
//   return false;
// });

// await async.forEach(playersInGame, async (player) => {
//   const user = (await client.users.fetch(player.discordId, { cache: true })).username;
//   const message = `${user} started a solo queue game`;

//   const channel = await client.channels.fetch(configuration.leagueChannelId);
//   if (channel?.isTextBased()) {
//     await channel.send(message);
//   } else {
//     throw new Error("not text based");
//   }
// });

// check if the players have just finished a game
const mostRecentGames = await async.map(
  players,
  async (player: PlayerConfig): Promise<[PlayerConfig, string | undefined]> => {
    const response = await api.MatchV5.list(player.league.puuid, Constants.RegionGroups.AMERICAS, {
      queue: 420,
      count: 1,
    });
    if (response.response.length == 0) {
      return [player, undefined];
    }
    return [player, response.response[0]];
  },
);

const filtered = (await async.filter(mostRecentGames, async (entry) => {
  return entry[1] !== undefined;
})) as IterableCollection<[PlayerConfig, string]>;

await async.map(filtered, async (entry: [PlayerConfig, string]) => {
  const playerConfig = entry[0];
  const response = await api.MatchV5.get(entry[1], Constants.RegionGroups.AMERICAS);
  const player = _.first(
    _.filter(response.response.info.participants, (participant) => participant.puuid === playerConfig.league.puuid),
  );
  if (player == undefined) {
    console.error("invalid state");
    return;
  }

  // TODO filter out old games

  let resultString: string;

  if (player.win) {
    resultString = "wodn";
  } else {
    resultString = "lost";
  }

  const user = (await client.users.fetch(playerConfig.discordId, { cache: true })).username;
  const message = `${user} ${resultString} a ${response.response.info.gameDuration / 60} minute game ${player.role}, ${
    player.kills
  }/${player.deaths}/${player.assists}`;

  const channel = await client.channels.fetch(configuration.leagueChannelId);
  if (channel?.isTextBased()) {
    await channel.send(message);
  } else {
    throw new Error("not text based");
  }
});

await client.destroy();
