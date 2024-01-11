import { Shoukaku, Connectors, NodeOption } from "shoukaku";
import client from "../discord/client.js";
import configuration from "../configuration.js";

export const nodes: NodeOption[] = [
  {
    name: "lavalink",
    url: configuration.lavalinkUrl,
    auth: configuration.lavalinkPassword,
  },
];

export const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), nodes, {});
