import { bold, userMention } from "npm:discord.js@14.14.1";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash@4.17.21";
import {
  Leaderboard,
  LeaderboardEntry,
  lpDiffToString,
} from "@glitter-boys/data";

export function leaderboardToDiscordMessage(leaderboard: Leaderboard): string {
  return _.chain(leaderboard.contents)
    .map(leaderboardEntryToDiscordMessage)
    .join("\n")
    .value();
}

function leaderboardEntryToDiscordMessage({
  position,
  leaguePointsDelta,
  player,
}: LeaderboardEntry): string {
  let positionString = `#${position.toString()}`;
  // top 3 are better than everyone else
  if (position <= 3) {
    positionString = bold(positionString);
  }

  return `${positionString}: ${userMention(
    player.config.discordAccount.id,
  )} ${bold(lpDiffToString(leaguePointsDelta))}`;
}
