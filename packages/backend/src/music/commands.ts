import { ChatInputCommandInteraction, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { shoukaku } from "./index.js";
import client from "../discord/client.js";
import { Player, Track } from "shoukaku";
import _ from "lodash";

let queue: Track[] = [];
let player: Player | undefined = undefined;

const musicCommand = new SlashCommandBuilder()
  .setName("music")
  .setDescription("Manage music playback")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("play")
      .setDescription("Play music")
      .addStringOption((option) => option.setName("song").setDescription("The song to play").setRequired(true)),
  )
  .addSubcommand((subcommand) => subcommand.setName("pause").setDescription("Pause music"))
  .addSubcommand((subcommand) => subcommand.setName("resume").setDescription("Resume music"))
  .addSubcommand((subcommand) => subcommand.setName("stop").setDescription("Stop music"))
  .addSubcommand((subcommand) => subcommand.setName("skip").setDescription("Skip music"))
  .addSubcommand((subcommand) => subcommand.setName("queue").setDescription("Show the music queue"))
  .addSubcommand((subcommand) => subcommand.setName("clear").setDescription("Clear the music queue"))
  .addSubcommand((subcommand) => subcommand.setName("shuffle").setDescription("Shuffle the music queue"))
  .addSubcommand((subcommand) =>
    subcommand
      .setName("volume")
      .setDescription("Set the volume of the music")
      .addNumberOption((option) =>
        option.setName("volume").setDescription("The volume to set").setRequired(true).setMinValue(0).setMaxValue(100),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("seek")
      .setDescription("Seek to a position in the music")
      .addNumberOption((option) =>
        option.setName("position").setDescription("The position to seek to in seconds").setRequired(true),
      ),
  )
  .addSubcommand((subcommand) => subcommand.setName("nowplaying").setDescription("Show the currently playing song"));

async function handleMusic(interaction: ChatInputCommandInteraction) {
  switch (interaction.options.getSubcommand()) {
    case "play":
      await handlePlayMusic(interaction);
      break;
    case "pause":
      await handlePauseMusic(interaction);
      break;
    case "resume":
      await handleResumeMusic(interaction);
      break;
    case "stop":
      await handleStopMusic(interaction);
      break;
    case "skip":
      await handleSkipMusic(interaction);
      break;
    case "queue":
      await handleQueueMusic(interaction);
      break;
    case "clear":
      await handleClearMusic(interaction);
      break;
    case "shuffle":
      await handleShuffleMusic(interaction);
      break;
    case "volume":
      await handleVolumeMusic(interaction);
      break;
    case "seek":
      await handleSeekMusic(interaction);
      break;
    case "nowplaying":
      await handleNowPlayingMusic(interaction);
      break;
  }
}

async function handlePauseMusic(interaction: ChatInputCommandInteraction) {
  if (player) {
    player.setPaused(true);
    await interaction.reply("paused");
  }
}

async function handleResumeMusic(interaction: ChatInputCommandInteraction) {
  if (player) {
    player.setPaused(false);
    await interaction.reply("resumed");
  }
}

async function handleStopMusic(interaction: ChatInputCommandInteraction) {
  if (player) {
    player.stopTrack();
    player = undefined;
    queue = [];
    const node = shoukaku.getNode();
    if (interaction.guildId && node) {
      node.leaveChannel(interaction.guildId);
    }
    await interaction.reply("stopped");
  }
}

async function handleSkipMusic(interaction: ChatInputCommandInteraction) {
  if (player) {
    player.stopTrack();
    await interaction.reply("skipped");
    const next = queue.pop();
    if (next !== undefined) {
      player.playTrack({
        track: next.track,
      });
    }
  }
}

async function handleQueueMusic(interaction: ChatInputCommandInteraction) {
  await interaction.reply(`queue: ${JSON.stringify(queue)}`);
}

async function handleClearMusic(interaction: ChatInputCommandInteraction) {
  queue = [];
  await interaction.reply("cleared");
  const node = shoukaku.getNode();
  if (interaction.guildId && node) {
    node.leaveChannel(interaction.guildId);
  }
}

async function handleShuffleMusic(interaction: ChatInputCommandInteraction) {
  queue = _.shuffle(queue);
  await interaction.reply("shuffled");
}

async function handleVolumeMusic(interaction: ChatInputCommandInteraction) {
  const volume = interaction.options.getInteger("volume", true);
  if (player) {
    player.setVolume(volume);
    await interaction.reply(`volume set to ${volume}`);
  }
}

async function handleSeekMusic(interaction: ChatInputCommandInteraction) {
  const position = interaction.options.getInteger("position", true);
  if (player) {
    player.seekTo(position);
    await interaction.reply(`seeked to ${position}`);
  }
}

async function handleNowPlayingMusic(interaction: ChatInputCommandInteraction) {
  if (player) {
    const track = player.track;
    await interaction.reply(`now playing: ${JSON.stringify(track)}`);
  }
}

async function getVoiceChannel(interaction: ChatInputCommandInteraction): Promise<VoiceBasedChannel | undefined> {
  const guildId = interaction.guildId;
  const memberId = interaction.user.id;
  if (!guildId) {
    return undefined;
  }
  const guild = await client.guilds.fetch(guildId);
  const member = await guild.members.fetch(memberId);

  // check if the member is in a voice channel
  if (!member.voice.channel) {
    console.log(member);
    return undefined;
  }

  return member.voice.channel;
}

async function handlePlayMusic(interaction: ChatInputCommandInteraction) {
  const song = interaction.options.getString("song", true);
  const node = shoukaku.getNode();

  if (!node) {
    await interaction.reply("no node");
    return;
  }

  const result = await node.rest.resolve(song);
  if (!result?.tracks.length) {
    await interaction.reply("unknown track");
    return;
  }

  const metadata = result.tracks.shift();
  if (metadata === undefined) {
    await interaction.reply("unknown track");
    return;
  }

  const channel = await getVoiceChannel(interaction);
  if (!channel) {
    await interaction.reply("not in a voice channel");
    return;
  }

  player = await node.joinChannel({
    guildId: channel.guild.id,
    channelId: channel.id,
    shardId: 0,
  });

  player.on("end", (_data) => {
    if (player !== undefined) {
      const next = queue.pop();
      if (next !== undefined) {
        player.playTrack({
          track: next.track,
        });
      }
    }
  });

  player.playTrack({
    track: metadata.track,
  });
  await interaction.reply(`playing ${JSON.stringify(metadata)}`);
}

export { musicCommand, handleMusic };
