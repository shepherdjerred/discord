import _ from "lodash";
import { chatGpt } from "./api.js";
import { readFile } from "fs/promises";
import { Match } from "../../../model/match.js";
import { getChats, writeChats } from "../../../model/chats.js";

const promptPath = "src/league/tasks/postmatch/feedback/prompts";

type Bios = {
  name: string;
  file: string;
  champions: string[];
  lanes: string[];
};

const bios: Bios[] = [
  { name: "Aaron", file: "aaron.txt", champions: ["Aatrox", "Yone", "Yasou"], lanes: ["top"] },
  { name: "Brian", file: "brian.txt", champions: ["Evelyn", "Senna"], lanes: ["Jungle"] },
  { name: "Irfan", file: "irfan.txt", champions: ["Zayah"], lanes: ["ADC"] },
  { name: "Neko Ryan", file: "nekoryan.txt", champions: ["Vayne", "Akali", "Ahri"], lanes: ["Mid"] },
];

export async function generateFeedbackMessage(match: Match) {
  const reviewer = _.chain(bios)
    .reject((bio) => bio.name === match.player.playerConfig.name)
    .sample()
    .value();
  if (!reviewer) {
    throw new Error(`No reviewer found: ${JSON.stringify(bios)}`);
  }

  let player = _.chain(bios)
    .filter((bio) => bio.name === match.player.playerConfig.name)
    .first()
    .value();
  if (!player) {
    player = { name: "Generic", file: "generic.txt", champions: [], lanes: [] };
  }

  const rawSystemMessage = (await readFile(`${promptPath}/system_message.txt`)).toString();
  const rawBasePrompt = (await readFile(`${promptPath}/base.txt`)).toString();
  const reviewerBioPrompt = (await readFile(`${promptPath}/bios/${reviewer.file}`)).toString();
  const playerBioPrompt = (await readFile(`${promptPath}/bios/${player.file}`)).toString();

  const replacements = [
    {
      placeholder: "<REVIEWER PERSONALITY>",
      replacement: reviewerBioPrompt,
    },
    {
      placeholder: "<PLAYER PERSONALITY>",
      replacement: playerBioPrompt,
    },
    {
      placeholder: "<REVIEWER NAME>",
      replacement: reviewer.name,
    },
    {
      placeholder: "<REVIEWER FAVORITE CHAMPIONS>",
      replacement: reviewer.champions.join(", "),
    },
    {
      placeholder: "<REVIEWER FAVORITE LANES>",
      replacement: reviewer.lanes.join(", "),
    },
    {
      placeholder: "<PLAYER NAME>",
      replacement: match.player.playerConfig.name,
    },
    {
      placeholder: "<PLAYER FAVORITE CHAMPIONS>",
      replacement: player.champions.join(", "),
    },
    {
      placeholder: "<PLAYER FAVORITE LANES>",
      replacement: player.lanes.join(", "),
    },
    {
      placeholder: "<PLAYER LANE>",
      replacement: match.player.lane || "unknown",
    },
    {
      placeholder: "<PLAYER TEAM>",
      replacement: match.player.team,
    },
    {
      placeholder: "<PLAYER CHAMPION>",
      replacement: match.player.champion.championName,
    },
    {
      placeholder: "<OPPONENT CHAMPION>",
      replacement: match.player.laneOpponent ? match.player.laneOpponent.championName : "unknown",
    },
    {
      placeholder: "<MATCH REPORT>",
      replacement: JSON.stringify(match),
    },
  ];

  let basePrompt = rawBasePrompt;
  for (const replacement of replacements) {
    basePrompt = basePrompt.replaceAll(replacement.placeholder, replacement.replacement);
  }
  console.log(basePrompt);

  let systemMessage = rawSystemMessage;
  for (const replacement of replacements) {
    systemMessage = systemMessage.replaceAll(replacement.placeholder, replacement.replacement);
  }
  console.log(systemMessage);

  const [chats, release] = await getChats();
  const parentMessageId = chats[match.player.playerConfig.name]?.[reviewer.name];

  const res = await chatGpt.sendMessage(basePrompt, {
    systemMessage: systemMessage,
    ...{
      ...(parentMessageId ? { parentMessageId: parentMessageId } : {}),
    },
  });

  chats[match.player.playerConfig.name] = {
    ...chats[match.player.playerConfig.name],
    [reviewer.name]: res.id,
  };

  await writeChats(chats);
  await release();
  return { name: reviewer.name, message: res.text };
}
