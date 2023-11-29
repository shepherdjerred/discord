import { ChatGPTAPI } from "https://esm.sh/chatgpt@5.2.5";
import configuration from "../../configuration.ts";
import Keyv from "https://esm.sh/keyv@4.5.4";

const keyv = new Keyv("sqlite://chatgpt.sqlite");

export const chatGpt = new ChatGPTAPI({
  apiKey: configuration.openAiAPiKey,
  completionParams: { model: "gpt-4" },
  messageStore: keyv,
});
