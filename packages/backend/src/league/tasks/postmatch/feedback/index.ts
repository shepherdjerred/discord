import _ from "lodash";
import { chatGpt } from "./api.js";
import { Match } from "../image/match.js";
import { readFile } from "fs/promises";

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

  const personalityPrompt = (await readFile(`${promptPath}/${randomPersonality.file}`)).toString();
  const basePrompt = (await readFile(`${promptPath}/base.txt`)).toString();

  const fullPrompt = basePrompt.replaceAll("<PROMPT>", personalityPrompt).replaceAll("<REPORT>", JSON.stringify(match));

  const res = await chatGpt.sendMessage(`${fullPrompt}`);
  return { name: randomPersonality.name, message: res.text };
}
