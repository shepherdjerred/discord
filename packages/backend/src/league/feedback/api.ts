import { ChatGPTAPI } from "chatgpt";
import configuration from "../../configuration.ts";
import Keyv from "keyv";

const keyv = new Keyv("sqlite://chatgpt.sqlite");

export const chatGpt = new ChatGPTAPI({
  apiKey: configuration.openAiAPiKey,
  completionParams: { model: "gpt-4" },
  messageStore: keyv,
});
