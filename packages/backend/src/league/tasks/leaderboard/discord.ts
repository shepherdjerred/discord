import { bold, userMention } from "discord.js";
import _ from "lodash";
import { Leaderboard, LeaderboardEntry } from "./index.js";
import { diffToString } from "../../model/leaguePoints.js";
import { rankToString } from "../../model/rank.js";

export function leaderboardToDiscordMessage(leaderboard: Leaderboard): string {
  return _.chain(leaderboard).map(leaderboardEntryToDiscordMessage).join("\n").value();
}

function leaderboardEntryToDiscordMessage({ position, leaguePointsDelta, player }: LeaderboardEntry): string {
  let positionString = `#${position.toString()}`;
  // top 3 are better than everyone else
  if (position <= 3) {
    positionString = bold(positionString);
  }

  const wins = Math.abs(player.config.league.initialRank.wins - player.currentRank.wins);
  const losses = Math.abs(player.config.league.initialRank.losses - player.currentRank.losses);
  const rank = player.currentRank;

  return `${positionString}: ${userMention(player.config.discordAccount.id)} ${bold(
    diffToString(leaguePointsDelta),
  )} LP   (${wins}W, ${losses}L, ${rankToString(rank)})`;
}
