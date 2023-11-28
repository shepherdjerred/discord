import { Events } from "https://esm.sh/discord.js";
import { handleKarma } from "../karma/commands.ts";
import "./rest.ts";
import client from "./client.ts";

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) {
      return;
    }
    switch (interaction.commandName) {
      case "karma":
        await handleKarma(interaction);
        break;
    }
  } catch (e) {
    console.error(e);
  }
});
