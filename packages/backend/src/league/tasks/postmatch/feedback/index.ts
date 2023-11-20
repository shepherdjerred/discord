import _ from "lodash";
import { chatGpt } from "./api.js";
import { readFile } from "fs/promises";
import { Match } from "../../../model/match.js";

const promptPath = "src/league/tasks/postmatch/feedback/prompts";

export async function generateFeedbackMessage(match: Match) {
  const randomPersonality = _.sample([
    { name: "Aaron", file: "aaron.txt" },
    { name: "Brian", file: "brian.txt" },
    { name: "Irfan", file: "irfan.txt" },
    { name: "Jerred", file: "jerred.txt" },
    { name: "Neko Ryan", file: "nekoryan.txt" },
  ]);
  if (!randomPersonality) {
    throw new Error("Illegal state");
  }

  const basePrompt = (await readFile(`${promptPath}/base.txt`)).toString();
  const personalityPrompt = (await readFile(`${promptPath}/${randomPersonality.file}`)).toString();
  const lanePrompt = (await readFile(`${promptPath}/lanes/${match.player.lane}.txt`)).toString();

  const replacements = [
    {
      placeholder: "<PLAYER LANE>",
      replacement: lanePrompt,
    },
    {
      placeholder: "<OPPONENT CHAMPION>",
      replacement: match.player.opponent.championName,
    },
    {
      placeholder: "<PERSONALITY>",
      replacement: personalityPrompt,
    },
    {
      placeholder: "<MATCH REPORT>",
      replacement: JSON.stringify(match),
    },
    {
      placeholder: "<PLAYER CHAMPION>",
      replacement: match.player.champion.championName,
    },
    {
      placeholder: "<PLAYER NAME>",
      replacement: match.player.playerConfig.name,
    },
  ];

  let tempPrompt = basePrompt;
  for (const replacement of replacements) {
    tempPrompt = tempPrompt.replaceAll(replacement.placeholder, replacement.replacement);
  }

  const res = await chatGpt.sendMessage(tempPrompt);
  return { name: randomPersonality.name, message: res.text };
}
