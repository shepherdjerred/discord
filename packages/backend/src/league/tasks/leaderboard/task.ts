import _ from "lodash";
import { getPlayer } from "../../model/player.js";
import { getPlayerConfigs } from "../../model/playerConfig.js";
import { leaderboardToDiscordMessage } from "./discord.js";
import { toLeaderboard } from "./index.js";
import { send } from "../../discord/channel.js";

export async function postLeaderboardMessage() {
  const playerConfigs = await getPlayerConfigs();
  const players = await Promise.all(_.map(playerConfigs, getPlayer));
  const leaderboard = toLeaderboard(players);
  const message = leaderboardToDiscordMessage(leaderboard);
  await send(message);
}
