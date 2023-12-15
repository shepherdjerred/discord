import { Events } from "discord.js";
import { handleKarma } from "../karma/commands.js";
import "./rest.js";
import client from "./client.js";
import { handleMusic } from "../music/commands.js";
import { handleCustoms } from "../customs/commands.js";

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) {
      return;
    }
    switch (interaction.commandName) {
      case "karma":
        await handleKarma(interaction);
        break;
      case "music":
        await handleMusic(interaction);
        break;
      case "customs":
        await handleCustoms(interaction);
        break;
    }
  } catch (e) {
    console.error(e);
  }
});
