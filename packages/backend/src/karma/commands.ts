import { SlashCommandBuilder, type Interaction, ChatInputCommandInteraction } from "discord.js";

const karmaCommand = new SlashCommandBuilder()
  .setName("karma")
  .setDescription("Recognize positive contributions with karma points")
  .addSubcommand((subcommand) => subcommand.setName("give").setDescription("Give karma to someone"))
  .addSubcommand((subcommand) =>
    subcommand
      .setName("take")
      .setDescription("Take karma away from someone")
      .addUserOption((option) =>
        option.setName("target").setDescription("The person you'd like to give karma to").setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("reason").setDescription("An optional reason about why they deserve karma").setMaxLength(200)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("leaderboard").setDescription("See karma values for everyone on the server")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("history")
      .setDescription("View recent changes to a person's karma")
      .addUserOption((option) =>
        option.setName("target").setDescription("The person whose karma history you'd like to view")
      )
  );

export { karmaCommand, handleKarmaGive, handleKarmaTake, handleKarmaLeaderboard, handleKarma };

async function handleKarmaGive(interaction: Interaction) {
  if (interaction.isRepliable()) {
    await interaction.reply("give");
  }
}

async function handleKarmaTake(interaction: Interaction) {
  if (interaction.isRepliable()) {
    await interaction.reply("take");
  }
}

async function handleKarmaLeaderboard(interaction: Interaction) {
  if (interaction.isRepliable()) {
    await interaction.reply("leaderboard");
  }
}

async function handleKarmaHistory(interaction: Interaction) {
  if (interaction.isRepliable()) {
    await interaction.reply("history");
  }
}

async function handleKarma(interaction: ChatInputCommandInteraction) {
  switch (interaction.options.getSubcommand()) {
    case "give":
      await handleKarmaGive(interaction);
      break;
    case "take":
      await handleKarmaTake(interaction);
      break;
    case "leaderboard":
      await handleKarmaLeaderboard(interaction);
      break;
    case "history":
      await handleKarmaHistory(interaction);
  }
}
