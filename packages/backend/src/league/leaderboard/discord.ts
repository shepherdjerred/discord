import { bold, userMention } from "discord.js";
import _ from "lodash";
import { Leaderboard, LeaderboardEntry } from "./index.js";

export function leaderboardToDiscordMessage(leaderboard: Leaderboard): string {
  return _.join(_.map(leaderboard, leaderboardEntryToDiscordMessage), "\n");
}

function leaderboardEntryToDiscordMessage({ rank, leaguePointsDelta, player }: LeaderboardEntry): string {
  let rankString = `#${rank.toString()}`;
  // top 3 are better than everyone else
  if (rank <= 3) {
    rankString = bold(rankString);
  }

  let lpString;
  if (leaguePointsDelta <= 0) {
    lpString = `(${leaguePointsDelta} LP)`;
  } else {
    lpString = `(+${leaguePointsDelta} LP)`;
  }

  return `${rankString}: ${userMention(player.config.discordAccount.id)} ${lpString}`;
}
