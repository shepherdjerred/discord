import Configuration from "../configuration.ts";
import { Client } from "https://esm.sh/discord.js";

const client = new Client({ intents: [] });

await client.login(Configuration.discordToken);

export default client;
