import { bold, userMention } from "discord.js";
import _ from "lodash";
import { Leaderboard, LeaderboardEntry } from "./index.js";
import { diffToString } from "../../model/leaguePoints.js";

export function leaderboardToDiscordMessage(leaderboard: Leaderboard): string {
  return _.chain(leaderboard).map(leaderboardEntryToDiscordMessage).join("\n").value();
}

function leaderboardEntryToDiscordMessage({ rank, leaguePointsDelta, player }: LeaderboardEntry): string {
  let rankString = `#${rank.toString()}`;
  // top 3 are better than everyone else
  if (rank <= 3) {
    rankString = bold(rankString);
  }

  return `${rankString}: ${userMention(player.config.discordAccount.id)} ${diffToString(leaguePointsDelta)} LP`;
}
