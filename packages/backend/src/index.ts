import { Client, Events, REST, Routes } from "discord.js";
import Configuration from "./configuration.js";
import { handleKarma, karmaCommand } from "./karma/commands.js";
// required for type orm
import "reflect-metadata";

const updateCommands = false;
const client = new Client({ intents: [] });

await client.login(Configuration.discordToken);

const rest = new REST({ version: "10" }).setToken(Configuration.discordToken);

await (async () => {
  const applicationId = "1092616671388254248";
  try {
    if (updateCommands) {
      const data = await rest.put(Routes.applicationCommands(applicationId), { body: getCommands() });
      console.log(data);
    }
  } catch (error) {
    console.error(error);
  }
})();

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  switch (interaction.commandName) {
    case "karma":
      await handleKarma(interaction);
      break;
  }
});

function getCommands() {
  return [karmaCommand.toJSON()];
}
