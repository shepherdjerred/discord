// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";
import { toLeaderboard } from "./index.ts";
import { getPlayer } from "../../player.ts";
import {
  CopyObjectCommand,
  PutObjectCommand,
} from "https://esm.sh/@aws-sdk/client-s3";
import configuration from "../../../configuration.ts";
import { s3 } from "../../s3.ts";
import { getPlayerConfigs } from "../../playerConfig.ts";
import { format } from "https://esm.sh/date-fns";
import { send } from "../../discord/channel.ts";
import { leaderboardToDiscordMessage } from "https://esm.sh/discord.js";

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
    Key: `previous.json`,
    ContentType: "application/json",
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
