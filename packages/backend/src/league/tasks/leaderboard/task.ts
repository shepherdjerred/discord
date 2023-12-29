import _ from "lodash";
import { toLeaderboard } from "./index.js";
import { getPlayer } from "../../model/player.js";
import { getDoubleXp, getPlayerConfigs } from "../../model/playerConfig.js";
import { leaderboardToDiscordMessage, setKing } from "./discord.js";
import { CopyObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { format } from "date-fns";
import configuration from "../../../configuration.js";
import { send } from "../../discord/channel.js";
import { s3 } from "../../s3.js";
import { Leaderboard } from "@glitter-boys/data";

const link = "https://glitter-boys.com/leaderboard/";

async function uploadLeaderboard(leaderboard: Leaderboard) {
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

export async function postLeaderboardMessage() {
  const playerConfigs = await getPlayerConfigs();
  const doubleXp = await getDoubleXp();
  const players = await Promise.all(_.map(playerConfigs, getPlayer));
  const leaderboard = toLeaderboard(players, doubleXp);
  const message = leaderboardToDiscordMessage(leaderboard);
  const messageWithLink = `View more details at ${link}\n${message}`;
  await send(messageWithLink);

  await uploadLeaderboard(leaderboard);

  const king = _.first(leaderboard.contents);

  if (king !== undefined) {
    await setKing(king.player.config);
  }
}
