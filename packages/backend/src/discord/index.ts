import { Events } from "discord.js";
import { handleKarma } from "./karma/commands.js";
import "./rest.js";
import client from "./client.js";

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
