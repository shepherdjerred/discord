import { REST, Routes } from "discord.js";
import Configuration from "../configuration.js";
import { karmaCommand } from "../karma/commands.js";

// the commands API is rate limited.
// we only need to update commands when the interfaces have changed.
const updateCommands = false;

const rest = new REST({ version: "10" }).setToken(Configuration.discordToken);

try {
  if (updateCommands) {
    const commands = [karmaCommand.toJSON()];
    await rest.put(Routes.applicationCommands(Configuration.applicationId), { body: commands });
  }
} catch (error) {
  console.error(error);
}
