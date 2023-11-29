import Configuration from "../configuration.js";
import { Client } from "discord.js";

const client = new Client({ intents: [] });
await client.login(Configuration.discordToken);
export default client;
