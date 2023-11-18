import { writeFile } from "fs/promises";
import _ from "lodash";
import { bold, userMention } from "discord.js";
import client from "../discord/client.js";
import configuration from "../configuration.js";
import { rankToLp } from "./utils.js";
import { loadPlayers } from "./player/config.js";
import { Player } from "./player/player.js";
import { getCurrentRank } from "./player/current.js";

export async function postLeaderboardMessage() {
  const players = await loadPlayers();

  const promises = _.map(players, async (player): Promise<Player> => {
    const currentRank = await getCurrentRank(player);
    return {
      config: player,
      currentRank: currentRank,
    };
  });

  const rankings = await Promise.all(promises);

  const checkpoint = {
    date: Date.now(),
    data: rankings,
  };

  await writeFile(`checkpoints/${checkpoint.date.toString()}.json`, JSON.stringify(checkpoint));

  const sorted = _.reverse(
    _.sortBy(rankings, (player) => rankToLp(player.currentRank) - rankToLp(player.config.league.initialRank)),
  );

  let rank = 0;
  let prev: number;

  const message = _.join(
    await Promise.all(
      _.map(sorted, async (entry) => {
        const lp = rankToLp(entry.currentRank) - rankToLp(entry.config.league.initialRank);

        // show ties
        if (lp !== prev) {
          rank++;
        }

        // make a copy of rank. I think this is required because the function is async?
        const myRank = rank;
        prev = lp;

        const user = await client.users.fetch(entry.config.discordAccount.id, { cache: true });

        let rankString = `#${myRank.toString()}`;
        // top 3 are better than everyone else
        if (myRank <= 3) {
          rankString = bold(rankString);
        }

        let lpString;
        if (lp <= 0) {
          lpString = `(${lp} LP)`;
        } else {
          lpString = `(+${lp} LP)`;
        }

        return `${rankString}: ${userMention(user.id)} ${lpString}`;
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
}
