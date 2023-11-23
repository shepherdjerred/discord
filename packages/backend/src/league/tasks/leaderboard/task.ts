import _ from "lodash";
import { toLeaderboard } from "./index.js";
import { getPlayer } from "../../player.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import configuration from "../../../configuration.js";
import { s3 } from "../../s3.js";
import { send } from "../../discord/channel.js";
import { leaderboardToDiscordMessage } from "./discord.js";
import { getPlayerConfigs } from "../../playerConfig.js";

const link = "https://glitter-boys.com/leaderboard/";

export async function postLeaderboardMessage() {
  const playerConfigs = await getPlayerConfigs();
  const players = await Promise.all(_.map(playerConfigs, getPlayer));
  const leaderboard = toLeaderboard(players);
  const message = leaderboardToDiscordMessage(leaderboard);
  const messageWithLink = `More details at ${link}\n${message}`;
  await send(messageWithLink);
  let command = new PutObjectCommand({
    Bucket: configuration.s3BucketName,
    Key: `leaderboard.json`,
    Body: JSON.stringify(leaderboard),
    ContentType: "application/json",
  });
  await s3.send(command);
  command = new PutObjectCommand({
    Bucket: configuration.s3BucketName,
    Key: `leaderboards/${leaderboard.date.toString()}.json`,
    Body: JSON.stringify(leaderboard),
    ContentType: "application/json",
  });
  await s3.send(command);
}
