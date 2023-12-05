import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { shoukaku } from "./index.js";
import client from "../discord/client.js";

const musicCommand = new SlashCommandBuilder()
  .setName("music")
  .setDescription("Manage music playback")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("play")
      .setDescription("Play music")
      .addStringOption((option) => option.setName("song").setDescription("The song to play").setRequired(true)),
  );

async function handleMusic(interaction: ChatInputCommandInteraction) {
  switch (interaction.options.getSubcommand()) {
    case "play":
      await handlePlayMusic(interaction);
      break;
  }
}

async function handlePlayMusic(interaction: ChatInputCommandInteraction) {
  const song = interaction.options.getString("song", true);
  const node = shoukaku.getNode();
  if (!node) {
    interaction.reply("no node");
    return;
  }
  const result = await node.rest.resolve(song);
  if (!result?.tracks.length) {
    interaction.reply("unknown track");
    return;
  }
  const metadata = result.tracks.shift();
  if (metadata === undefined) {
    interaction.reply("unknown track");
    return;
  }

  const guildId = interaction.guildId;
  const memberId = interaction.user.id;
  if (!guildId) {
    interaction.reply("you must be in a guild");
    return;
  }
  const guild = await client.guilds.fetch(guildId);
  const member = await guild.members.fetch(memberId);

  // check if the member is in a voice channel
  if (!member.voice.channel) {
    interaction.reply("you must be in a voice channel");
    console.log(member);
    return;
  }

  const channelId = member.voice.channel.id;

  const player = await node.joinChannel({
    guildId,
    channelId,
    shardId: 0,
  });
  player.playTrack({
    track: metadata.track,
  });
  interaction.reply("playing");
}

export { musicCommand, handleMusic };
