import { ChatInputCommandInteraction, SlashCommandBuilder, userMention } from "discord.js";

const customsCommand = new SlashCommandBuilder()
  .setName("customs")
  .setDescription("League customs")
  .addSubcommandGroup((group) =>
    group
      .setName("leader")
      .setDescription("manage team leaders")
      .addSubcommand((subcommand) => subcommand.setName("random").setDescription("set random team leaders"))
      .addSubcommand((subcommand) =>
        subcommand
          .setName("set")
          .setDescription("set team leaders")
          .addUserOption((option) => option.setName("red").setDescription("red team leader").setRequired(true))
          .addUserOption((option) => option.setName("blue").setDescription("blue team leader").setRequired(true)),
      ),
  )
  .addSubcommand((subcommand) => subcommand.setName("init").setDescription("initialize a new customs match"))
  .addSubcommand((subcommand) => subcommand.setName("join").setDescription("join the player pool"))
  .addSubcommand((subcommand) =>
    subcommand
      .setName("kick")
      .setDescription("kick a player")
      .addUserOption((option) => option.setName("user").setDescription("user to kick").setRequired(true)),
  )
  .addSubcommand((subcommand) => subcommand.setName("reset").setDescription("reset the match"))
  .addSubcommand((subcommand) =>
    subcommand
      .setName("pick")
      .setDescription("pick a player")
      .addUserOption((option) => option.setName("user").setDescription("user to pick").setRequired(true)),
  )
  .addSubcommand((subcommand) => subcommand.setName("start").setDescription("start the match"))
  .addSubcommand((subcommand) => subcommand.setName("debug").setDescription("print debug information"));

async function handleCustoms(interaction: ChatInputCommandInteraction) {
  switch (interaction.options.getSubcommandGroup()) {
    case "leader":
      switch (interaction.options.getSubcommand()) {
        case "random":
          await handleLeaderRandom(interaction);
          break;
        case "set":
          await handleLeaderSet(interaction);
          break;
        default:
          throw new Error("unreachable");
      }
      break;
  }
  switch (interaction.options.getSubcommand()) {
    case "init":
      await handleInit(interaction);
      break;
    case "join":
      await handleJoin(interaction);
      break;
    case "kick":
      await handleKick(interaction);
      break;
    case "pick":
      await handlePick(interaction);
      break;
    case "reset":
      await handleReset(interaction);
      break;
    case "start":
      await handleStart(interaction);
      break;
    case "debug":
      await handleDebug(interaction);
      break;
    default:
      throw new Error("unreachable");
  }
}

let host: string | undefined;
let players: string[] = [];
let leaders: { red: string; blue: string } | undefined;
let teams: { red: string[]; blue: string[] } | undefined;
let turn: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | undefined;

async function handleDebug(interaction: ChatInputCommandInteraction) {
  await interaction.reply({
    content: `${JSON.stringify({
      host,
      players,
      leaders,
      teams,
      turn,
    })}`,
    ephemeral: true,
  });
}

async function handleInit(interaction: ChatInputCommandInteraction) {
  reset();
  host = interaction.user.id;
  players = [interaction.user.id];
  await interaction.reply({ content: `${host} has initialized a new customs match.` });
}

function reset() {
  players = [];
  leaders = undefined;
  teams = undefined;
  turn = undefined;
  host = undefined;
}

async function handleJoin(interaction: ChatInputCommandInteraction) {
  if (teams === undefined) {
    if (players.length <= 10) {
      players.push(interaction.user.id);
      if (players.length === 10) {
        await interaction.reply({
          content: `${interaction.user.id} joined the player pool. The player pool is now full.`,
        });
      } else {
        await interaction.reply({
          content: `${interaction.user.id} joined the player pool. ${players.length - 10} more players needed.`,
        });
      }
    } else {
      await interaction.reply({
        content: "The player pool is full.",
        ephemeral: true,
      });
    }
  } else {
    await interaction.reply({
      content: "You cannot join the player pool after teams have been picked.",
      ephemeral: true,
    });
  }
}

async function handleKick(interaction: ChatInputCommandInteraction) {
  if (host !== interaction.user.id) {
    await interaction.reply({
      content: "You are not the host.",
      ephemeral: true,
    });
    return;
  }

  const user = interaction.options.getUser("user", true);
  if (players.includes(user.id)) {
    players = players.filter((player) => player !== user.id);
    await interaction.reply({ content: `${userMention(user.id)} has been kicked from the player pool.` });
  } else {
    await interaction.reply({ content: `${userMention(user.id)} is not in the player pool.`, ephemeral: true });
  }
}

async function handlePick(interaction: ChatInputCommandInteraction) {
  // check that the user is a leader, and that it's the team's turn
  if (leaders === undefined) {
    return interaction.reply({
      content: "Team leaders have not been picked.",
      ephemeral: true,
    });
  }

  if (teams === undefined) {
    teams = { red: [], blue: [] };
  }

  const user = interaction.options.getUser("user", true);

  if (turn === undefined) {
    turn = 1;
  }

  let team: "red" | "blue";

  // check if the user is a leader
  if (leaders.red === user.id) {
    team = "red";
  } else if (leaders.blue === user.id) {
    team = "blue";
  } else {
    return interaction.reply({
      content: "You are not a team leader.",
      ephemeral: true,
    });
  }

  if (team === "red") {
    if (turn === 1 || turn === 4 || turn === 5 || turn === 8) {
      return interaction.reply({
        content: "It is not your team's turn.",
        ephemeral: true,
      });
    }
  } else if (team === "blue") {
    if (turn === 2 || turn === 3 || turn === 6 || turn === 7) {
      return interaction.reply({
        content: "It is not your team's turn.",
        ephemeral: true,
      });
    }
  }

  if (!players.includes(user.id)) {
    return interaction.reply({
      content: "The user is not in the player pool or has already been picked.",
      ephemeral: true,
    });
  }

  // add the user to the team
  teams[team].push(user.id);

  // remove the user from the player pool
  players = players.filter((player) => player !== user.id);
  if (turn === 8) {
    return await interaction.reply({
      content: `${userMention(
        user.id,
      )} has been picked for the ${team} team. Teams are now complete. Use \`/customs start\` to start the match.`,
    });
  } else {
    return await interaction.reply({
      content: `${userMention(
        user.id,
      )} has been picked for the ${team} team. It's now the ${turn} turn. The following players are up for draft: ${players.join(
        "\n",
      )}`,
    });
  }
}

async function handleReset(interaction: ChatInputCommandInteraction) {
  reset();
  await interaction.reply({ content: "Customs match state reset.", ephemeral: true });
}

async function handleStart(interaction: ChatInputCommandInteraction) {
  if (host !== interaction.user.id) {
    await interaction.reply({
      content: "You are not the host.",
      ephemeral: true,
    });
    return;
  }

  if (players.length < 10) {
    await interaction.reply({
      content: "The player pool is not full.",
      ephemeral: true,
    });
    return;
  }

  if (leaders === undefined) {
    await interaction.reply({
      content: "Team leaders have not been picked.",
      ephemeral: true,
    });
    return;
  }

  if (teams === undefined || teams.red.length !== 5 || teams.blue.length !== 5) {
    await interaction.reply({
      content: "Teams have not been picked.",
      ephemeral: true,
    });
    return;
  }

  // TODO: put teams in the correct channels

  reset();

  await interaction.reply({ content: "Customs match started.", ephemeral: true });
}

async function handleLeaderRandom(interaction: ChatInputCommandInteraction) {
  if (host !== interaction.user.id) {
    await interaction.reply({
      content: "You are not the host.",
      ephemeral: true,
    });
    return;
  }

  if (players.length < 10) {
    await interaction.reply({
      content: "The player pool is not full.",
      ephemeral: true,
    });
    return;
  }

  const red = players[Math.floor(Math.random() * players.length)];
  players = players.filter((player) => player !== red);
  const blue = players[Math.floor(Math.random() * players.length)];
  players = players.filter((player) => player !== blue);

  if (red === undefined || blue === undefined) {
    throw new Error("unreachable");
  }

  leaders = { red, blue };
  teams = { red: [red], blue: [blue] };

  await interaction.reply({
    content: `Team leaders have been randomly picked. Red: ${red}, Blue: ${blue}`,
    ephemeral: true,
  });
}

async function handleLeaderSet(interaction: ChatInputCommandInteraction) {
  if (host !== interaction.user.id) {
    await interaction.reply({
      content: "You are not the host.",
      ephemeral: true,
    });
    return;
  }

  const red = interaction.options.getUser("red", true);
  const blue = interaction.options.getUser("blue", true);

  if (players.includes(red.id)) {
    // do nothing
  } else {
    await interaction.reply({ content: `${userMention(red.id)} is not in the player pool.`, ephemeral: true });
    return;
  }

  if (players.includes(blue.id)) {
    // do nothing
  } else {
    await interaction.reply({ content: `${userMention(blue.id)} is not in the player pool.`, ephemeral: true });
    return;
  }

  players = players.filter((player) => player !== red.id);
  players = players.filter((player) => player !== blue.id);

  leaders = { red: red.id, blue: blue.id };
  teams = { red: [red.id], blue: [blue.id] };

  await interaction.reply({
    content: `Team leaders have been picked. Red: ${userMention(red.id)}, Blue: ${userMention(blue.id)}`,
  });
}

export { customsCommand, handleCustoms };
