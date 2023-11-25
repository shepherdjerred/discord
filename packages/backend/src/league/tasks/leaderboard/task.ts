import _ from "lodash";
import { toLeaderboard } from "./index.js";
import { getPlayer } from "../../player.js";
import { CopyObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import configuration from "../../../configuration.js";
import { s3 } from "../../s3.js";
import { getPlayerConfigs } from "../../playerConfig.js";
import { format } from "date-fns";
import { send } from "../../discord/channel.js";
import { leaderboardToDiscordMessage } from "./discord.js";

const link = "https://glitter-boys.com/leaderboard/";

export async function postLeaderboardMessage() {
  const playerConfigs = await getPlayerConfigs();
  const players = await Promise.all(_.map(playerConfigs, getPlayer));
  const leaderboard = toLeaderboard(players);
  const message = leaderboardToDiscordMessage(leaderboard);
  const messageWithLink = `View more details at ${link}\n${message}`;
  await send(messageWithLink);

  const copyCommand = new CopyObjectCommand({
    Bucket: configuration.s3BucketName,
    CopySource: `${configuration.s3BucketName}/leaderboard.json`,
    Key: `leaderboards/previous.json`,
  });
  await s3.send(copyCommand);

  let putCommand = new PutObjectCommand({
    Bucket: configuration.s3BucketName,
    Key: `leaderboard.json`,
    Body: JSON.stringify(leaderboard),
    ContentType: "application/json",
  });
  await s3.send(putCommand);
  const date = format(new Date(), "yyyy-MM-dd");
  putCommand = new PutObjectCommand({
    Bucket: configuration.s3BucketName,
    Key: `leaderboards/${date}.json`,
    Body: JSON.stringify(leaderboard),
    ContentType: "application/json",
  });
  await s3.send(putCommand);
}
