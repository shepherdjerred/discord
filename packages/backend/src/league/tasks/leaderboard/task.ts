import _ from "lodash";
import { getPlayerConfigs } from "@glitter-boys/data";
import { toLeaderboard } from "./index.js";
import { getPlayer } from "../../player.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import configuration from "../../../configuration.js";
import { s3 } from "../../s3.js";

export async function postLeaderboardMessage() {
  const playerConfigs = await getPlayerConfigs();
  const players = await Promise.all(_.map(playerConfigs, getPlayer));
  const leaderboard = toLeaderboard(players);
  // const message = leaderboardToDiscordMessage(leaderboard);
  // await send(message);
  const command = new PutObjectCommand({
    Bucket: configuration.s3BucketName,
    Key: `leaderboard.json`,
    Body: JSON.stringify(leaderboard),
    ContentType: "application/json",
  });
  await s3.send(command);
}
