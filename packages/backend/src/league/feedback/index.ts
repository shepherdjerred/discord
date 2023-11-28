// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";
import { chatGpt } from "./api.ts";
import { Match } from "@glitter-boys/data";

const promptPath = "src/league/feedback/prompts";

type Bios = {
  name: string;
  file: string;
  champions: string[];
  lanes: string[];
};

const bios: Bios[] = [
  {
    name: "Aaron",
    file: "aaron.txt",
    champions: ["Aatrox", "Yone", "Yasou"],
    lanes: ["top"],
  },
  {
    name: "Brian",
    file: "brian.txt",
    champions: ["Evelyn", "Senna"],
    lanes: ["Jungle"],
  },
  { name: "Irfan", file: "irfan.txt", champions: ["Zayah"], lanes: ["ADC"] },
  {
    name: "Neko Ryan",
    file: "nekoryan.txt",
    champions: ["Vayne", "Akali", "Ahri"],
    lanes: ["Mid"],
  },
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

  const rawSystemMessage = await Deno.readTextFile(
    `${promptPath}/system_message.txt`
  );
  const rawBasePrompt = await Deno.readTextFile(`${promptPath}/base.txt`);
  const reviewerBioPrompt = await Deno.readTextFile(
    `${promptPath}/bios/${reviewer.file}`
  );
  const reviewerInstructionsPrompt = await Deno.readTextFile(
    `${promptPath}/instructions/${reviewer.file}`
  );
  const playerBioPrompt = await Deno.readTextFile(
    `${promptPath}/bios/${player.file}`
  );

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
      placeholder: "<REVIEWER INSTRUCTIONS>",
      replacement: reviewerInstructionsPrompt,
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
      replacement: match.player.laneOpponent
        ? match.player.laneOpponent.championName
        : "unknown",
    },
    {
      placeholder: "<MATCH REPORT>",
      replacement: JSON.stringify(match),
    },
  ];

  let basePrompt = rawBasePrompt;
  for (const replacement of replacements) {
    basePrompt = basePrompt.replaceAll(
      replacement.placeholder,
      replacement.replacement
    );
  }
  console.log(basePrompt);

  let systemMessage = rawSystemMessage;
  for (const replacement of replacements) {
    systemMessage = systemMessage.replaceAll(
      replacement.placeholder,
      replacement.replacement
    );
  }
  console.log(systemMessage);

  await chatGpt.sendMessage(basePrompt, {
    systemMessage: systemMessage,
  });
}
