import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextBasedChannel,
  VoiceBasedChannel,
  channelMention,
  userMention,
} from "discord.js";
import { shoukaku } from "./index.js";
import client from "../discord/client.js";
import { Player, Track } from "shoukaku";
import _ from "lodash";

let queue: Track[] = [];
let current: Track | undefined;
let player: Player | undefined;
let channel: VoiceBasedChannel | undefined;
let textChannel: TextBasedChannel | undefined;

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
      .addIntegerOption((option) =>
        option.setName("volume").setDescription("The volume to set").setRequired(true).setMinValue(0).setMaxValue(10),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("seek")
      .setDescription("Seek to a position in the music")
      .addIntegerOption((option) =>
        option.setName("position").setDescription("The position to seek to in seconds").setRequired(true),
      ),
  )
  .addSubcommand((subcommand) => subcommand.setName("nowplaying").setDescription("Show the currently playing song"))
  .addSubcommand((subcommand) => subcommand.setName("reset").setDescription("Reset the music filters"));

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
    case "reset":
      await handleResetMusic(interaction);
      break;
  }
}

async function handleResetMusic(interaction: ChatInputCommandInteraction) {
  if (player) {
    player.clearFilters();
    await interaction.reply(`${userMention(interaction.user.id)} reset filters`);
  } else {
    await interaction.reply({ ephemeral: true, content: "Nothing is playing." });
  }
}

async function handlePauseMusic(interaction: ChatInputCommandInteraction) {
  if (player) {
    if (player.paused) {
      await interaction.reply({ ephemeral: true, content: "The music is already paused." });
      return;
    } else {
      player.setPaused(true);
      await interaction.reply(`${userMention(interaction.user.id)} paused the music`);
    }
  } else {
    await interaction.reply({ ephemeral: true, content: "Nothing is playing." });
  }
}

async function handleResumeMusic(interaction: ChatInputCommandInteraction) {
  if (player) {
    if (player.paused) {
      player.setPaused(false);
      await interaction.reply(`${userMention(interaction.user.id)} resumed the music`);
    } else {
      await interaction.reply({ ephemeral: true, content: "The music is not paused." });
    }
  } else {
    await interaction.reply({ ephemeral: true, content: "Nothing is playing." });
  }
}

async function handleStopMusic(interaction: ChatInputCommandInteraction) {
  if (player) {
    if (current === undefined) {
      await interaction.reply({ ephemeral: true, content: "Nothing is playing." });
    } else {
      player.stopTrack();
      player = undefined;
      queue = [];
      current = undefined;

      const node = shoukaku.getNode();

      if (node) {
        if (channel) {
          node.leaveChannel(channel.guild.id);
        }
      } else {
        console.error(`node is undefined`);
      }

      channel = undefined;

      await interaction.reply(`${userMention(interaction.user.id)} stopped the music.`);
    }
  } else {
    await interaction.reply({ ephemeral: true, content: "Nothing is playing." });
  }
}

async function handleSkipMusic(interaction: ChatInputCommandInteraction) {
  if (player) {
    if (current !== undefined) {
      const currentCopy = current;
      player.stopTrack();
      await interaction.reply(`${userMention(interaction.user.id)} skipped ${currentCopy.info.title}`);
    } else {
      await interaction.reply({ ephemeral: true, content: "Nothing is playing." });
    }
  } else {
    await interaction.reply({ ephemeral: true, content: "Nothing is playing." });
  }
}

async function handleQueueMusic(interaction: ChatInputCommandInteraction) {
  const songs = queue.map((track) => `* ${track.info.title} by ${track.info.author} - ${track.info.uri}`);
  await interaction.reply({ content: `Queue:\n${songs.join("\n")}`, ephemeral: true });
}

async function handleClearMusic(interaction: ChatInputCommandInteraction) {
  queue = [];
  await interaction.reply(`${userMention(interaction.user.id)} cleared the queue.`);
}

async function handleShuffleMusic(interaction: ChatInputCommandInteraction) {
  queue = _.shuffle(queue);
  await interaction.reply(`${userMention(interaction.user.id)} shuffled the queue.`);
}

async function handleVolumeMusic(interaction: ChatInputCommandInteraction) {
  const volume = interaction.options.getInteger("volume", true);
  if (player) {
    player.setVolume(volume);
    await interaction.reply(`${userMention(interaction.user.id)} set volume to ${volume}%`);
  } else {
    await interaction.reply({ ephemeral: true, content: "Nothing is playing." });
  }
}

async function handleSeekMusic(interaction: ChatInputCommandInteraction) {
  const position = interaction.options.getInteger("position", true);
  if (player) {
    player.seekTo(position * 1000);
    await interaction.reply(`${userMention(interaction.user.id)} seeked to ${position} seconds.`);
  } else {
    await interaction.reply({ ephemeral: true, content: "Nothing is playing." });
  }
}

async function handleNowPlayingMusic(interaction: ChatInputCommandInteraction) {
  if (player && current !== undefined) {
    await interaction.reply({
      content: `Now playing: ${current.info.title} by ${current.info.author} - ${current.info.uri}`,
      ephemeral: true,
    });
  } else {
    await interaction.reply({ ephemeral: true, content: "Nothing is playing." });
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
    await interaction.reply({ ephemeral: true, content: "No node available" });
    return;
  }

  let search = song;

  if (!song.startsWith("http") && !song.startsWith("https")) {
    search = `ytsearch:${song}`;
  }

  const result = await node.rest.resolve(search);
  const metadata = result?.tracks.shift();
  if (!metadata) {
    await interaction.reply({ ephemeral: true, content: `No track matches \`${search}\`` });
    return;
  }

  const playerChannel = await getVoiceChannel(interaction);
  if (!playerChannel) {
    await interaction.reply({ ephemeral: true, content: "You must be in a voice channel to play music" });
    return;
  }

  if (channel?.id !== undefined && channel.id !== playerChannel.id) {
    await interaction.reply({ ephemeral: true, content: `Music is already playing in ${channelMention(channel.id)}` });
    return;
  }

  if (interaction.channel === null) {
    await interaction.reply({ ephemeral: true, content: "Text channel is null" });
    return;
  }

  if (current === undefined) {
    textChannel = interaction.channel;
    channel = playerChannel;
    current = metadata;

    if (player === undefined) {
      player = await node.joinChannel({
        guildId: channel.guild.id,
        channelId: channel.id,
        shardId: 0,
      });

      player.on("end", (_data) => {
        if (player === undefined) {
          console.error(`player is undefined at the end of a song`);
        } else {
          const next = queue.pop();
          current = next;
          if (next === undefined) {
            if (textChannel === undefined) {
              console.error(`textChannel is undefined at the end of a song`);
            } else {
              void textChannel.send("The queue is empty.");
            }
          } else {
            player.playTrack({
              track: next.track,
            });
            if (textChannel === undefined) {
              console.error(`textChannel is undefined at the end of a song`);
            } else {
              void textChannel.send(`Now playing: ${next.info.title} by ${next.info.author} - ${next.info.uri}`);
            }
          }
        }
      });
    } else {
      queue.push(metadata);
      await interaction.reply(
        `Added ${metadata.info.title} by ${metadata.info.author} - ${metadata.info.uri} to the queue.`,
      );
    }

    player.playTrack({
      track: metadata.track,
    });
    await interaction.reply(`Now playing: ${metadata.info.title} by ${metadata.info.author} - ${metadata.info.uri}`);
  }
}

export { musicCommand, handleMusic };
