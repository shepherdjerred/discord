import { bold, userMention } from "discord.js";
import _ from "lodash";
import { Leaderboard, LeaderboardEntry, PlayerConfigEntry, rankToString } from "@glitter-boys/data";
import client from "../../../discord/client.js";
import configuration from "../../../configuration.js";

export function leaderboardToDiscordMessage(leaderboard: Leaderboard): string {
  return _.chain(leaderboard.contents).map(leaderboardEntryToDiscordMessage).join("\n").value();
}

function leaderboardEntryToDiscordMessage({ position, player }: LeaderboardEntry): string {
  let positionString = `#${position.toString()}`;
  // top 3 are better than everyone else
  if (position <= 3) {
    positionString = bold(positionString);
  }

  return `${positionString}: ${userMention(player.config.discordAccount.id)} ${bold(rankToString(player.ranks.solo))}`;
}

export async function setKing(king: PlayerConfigEntry) {
  const guild = await client.guilds.fetch(configuration.guildId);
  const role = await guild.roles.fetch(configuration.leaderboardRoleId);
  if (role === null) {
    throw new Error("unable to find role");
  }
  await Promise.all(role.members.map((member) => member.roles.remove(role)));
  const kingMember = await guild.members.fetch(king.discordAccount.id);
  await kingMember.roles.add(role);
}
