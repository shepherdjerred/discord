import { bold, userMention } from "discord.js";
import _ from "lodash";
import { Leaderboard, LeaderboardEntry, lpDiffToString } from "@glitter-boys/data";

export function leaderboardToDiscordMessage(leaderboard: Leaderboard): string {
  return _.chain(leaderboard.contents).map([leaderboardEntryToDiscordMessage]).join("\n").value();
}

function leaderboardEntryToDiscordMessage({ position, leaguePointsDelta, player }: LeaderboardEntry): string {
  let positionString = `#${position.toString()}`;
  // top 3 are better than everyone else
  if (position <= 3) {
    positionString = bold(positionString);
  }

  return `${positionString}: ${userMention(player.config.discordAccount.id)} ${bold(
    lpDiffToString(leaguePointsDelta),
  )}`;
}
