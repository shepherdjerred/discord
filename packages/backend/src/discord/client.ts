import Configuration from "../configuration.js";
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
await client.login(Configuration.discordToken);
export default client;
