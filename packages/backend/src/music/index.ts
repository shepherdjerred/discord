import { Shoukaku, Connectors } from "shoukaku";
import client from "../discord/client.js";
import configuration from "../configuration.js";

export const shoukaku = new Shoukaku(
  new Connectors.DiscordJS(client),
  [
    {
      name: "lavalink",
      url: configuration.lavalinkUrl,
      auth: configuration.lavalinkPassword,
    },
  ],
  {},
);
