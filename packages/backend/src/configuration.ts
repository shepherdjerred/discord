import dotenv from "dotenv";
import env from "env-var";

dotenv.config();

export default {
  discordToken: env.get("DISCORD_TOKEN").required().asString(),
  applicationId: env.get("APPLICATION_ID").required().asString(),
  guildId: env.get("GUILD_ID").required().asString(),
  leaderboardRoleId: env.get("LEADERBOARD_ROLE_ID").required().asString(),
  dataDir: env.get("DATA_DIR").required().asString(),
  riotApiToken: env.get("RIOT_API_TOKEN").required().asString(),
  leagueChannelId: env.get("LEAGUE_CHANNEL_ID").required().asString(),
  openAiAPiKey: env.get("OPENAI_API_KEY").required().asString(),
  s3BucketName: env.get("S3_BUCKET_NAME").required().asString(),
  awsEndpointUrl: env.get("AWS_ENDPOINT_URL").required().asString(),
  awsRegion: env.get("AWS_REGION").required().asString(),
  awsAccessKeyId: env.get("AWS_ACCESS_KEY_ID").required().asString(),
  awsSecretAccessKey: env.get("AWS_SECRET_ACCESS_KEY").required().asString(),
  lavalinkUrl: env.get("LAVALINK_URL").required().asString(),
  lavalinkPassword: env.get("LAVALINK_PASSWORD").required().asString(),
};
