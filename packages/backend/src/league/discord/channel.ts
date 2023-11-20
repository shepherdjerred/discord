import { MessagePayload, MessageCreateOptions } from "discord.js";
import configuration from "../../configuration.js";
import client from "../../discord/client.js";

export async function send(options: string | MessagePayload | MessageCreateOptions) {
  const channel = await client.channels.fetch(configuration.leagueChannelId);
  if (!channel?.isTextBased()) {
    throw new Error("invalid channel");
  }
  return channel.send(options);
}
