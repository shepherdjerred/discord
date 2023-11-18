import _ from "lodash";
import client from "../../../discord/client.js";
import configuration from "../../../configuration.js";
import { getPlayer } from "../../model/player.js";
import { getPlayerConfigs } from "../../model/playerConfig.js";
import { leaderboardToDiscordMessage } from "./discord.js";
import { toLeaderboard } from "./index.js";

export async function postLeaderboardMessage() {
  const playerConfigs = await getPlayerConfigs();
  const players = await Promise.all(_.map(playerConfigs, getPlayer));
  const leaderboard = toLeaderboard(players);
  const message = leaderboardToDiscordMessage(leaderboard);

  const channel = await client.channels.fetch(configuration.leagueChannelId);

  if (channel?.isTextBased()) {
    await channel.send(message);
  } else {
    throw new Error("invalid channel");
  }
}
