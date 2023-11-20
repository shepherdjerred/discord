import configuration from "../../configuration.js";
import client from "../../discord/client.js";

const channel = await client.channels.fetch(configuration.leagueChannelId);
if (!channel?.isTextBased()) {
  throw new Error("invalid channel");
}

export const textChannel = channel;
