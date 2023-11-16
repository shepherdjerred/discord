import { open, writeFile } from "fs/promises";
import { Player, PlayersConfigSchema, TierSchema } from "./model.js";
import _ from "lodash";
import { Constants, LolApi } from "twisted";
import { match } from "ts-pattern";
import { bold } from "discord.js";
import client from "../discord/client.js";
import configuration from "../configuration.js";
import { rankToLp } from "./utils.js";

const file = await open("players.json");
const playersJson = (await file.readFile()).toString();
await file.close();

const players = PlayersConfigSchema.parse(JSON.parse(playersJson));

const api = new LolApi({
  key: configuration.riotApiToken,
});

function stringToDivision(input: string): number {
  return match(input)
    .with("IV", () => 4)
    .with("III", () => 3)
    .with("II", () => 2)
    .with("I", () => 1)
    .run();
}

const promises = _.map(players, async (player): Promise<Player> => {
  const response = await api.League.bySummoner(player.league.id, Constants.Regions.AMERICA_NORTH);
  const soloQueue = _.first(response.response.filter((entry) => entry.queueType === "RANKED_SOLO_5x5"));
  if (!soloQueue) {
    throw new Error("unable to find solo queue");
  }
  return {
    startingRank: player.startingRank,
    discordId: player.discordId,
    rank: {
      division: stringToDivision(soloQueue.rank),
      tier: TierSchema.parse(soloQueue.tier.toLowerCase()),
      lp: soloQueue?.leaguePoints,
      wins: soloQueue.wins,
      losses: soloQueue.losses,
    },
  };
});

const rankings = await Promise.all(promises);

const checkpoint = {
  date: Date.now(),
  data: rankings,
};

await writeFile(`checkpoints/${checkpoint.date.toString()}.json`, JSON.stringify(checkpoint));

const sorted = _.reverse(_.sortBy(rankings, (player) => rankToLp(player.rank) - rankToLp(player.startingRank)));

let rank = 0;
let prev: number;

const message = _.join(
  await Promise.all(
    _.map(sorted, async (entry) => {
      const lp = rankToLp(entry.rank) - rankToLp(entry.startingRank);

      // show ties
      if (lp !== prev) {
        rank++;
      }

      // make a copy of rank. I think this is required because the function is async?
      const myRank = rank;
      prev = lp;

      // mention the user who called the leaderboard command
      const user = (await client.users.fetch(entry.discordId, { cache: true })).username;

      let rankString = `#${myRank.toString()}`;
      // top 3 are better than everyone else
      if (myRank <= 3) {
        rankString = bold(rankString);
      }

      let lpString;
      if (lp < 0) {
        lpString = `(${lp} LP)`;
      } else {
        lpString = `(+${lp} LP)`;
      }

      return `${rankString}: ${user} ${lpString}`;
    }),
  ),
  "\n",
);

const channel = await client.channels.fetch(configuration.leagueChannelId);
if (channel?.isTextBased()) {
  await channel.send(message);
} else {
  throw new Error("not text based");
}
