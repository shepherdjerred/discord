import { ChatGPTAPI } from "chatgpt";
import configuration from "../../../../configuration.js";

export const chatGpt = new ChatGPTAPI({
  apiKey: configuration.openAiAPiKey,
  completionParams: { model: "gpt-4" },
});
