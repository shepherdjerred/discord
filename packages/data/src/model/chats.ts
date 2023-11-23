import _ from "lodash";
import { z } from "zod";
import { writeFile, open } from "fs/promises";
import { lock } from "proper-lockfile";

// the chat for one player
// the key is the reviewer, the value is the parent message id
export type PlayerChats = z.infer<typeof PlayerChatsSchema>;
export const PlayerChatsSchema = z.record(z.string(), z.string());

// the chats for all players
// the key is the player, the value is a map of reviewer to parent message id
export type Chats = z.infer<typeof ChatsSchema>;
export const ChatsSchema = z.record(z.string(), PlayerChatsSchema);

const chatsFileName = "chats.json";

export async function getChats(): Promise<[Chats, () => Promise<void>]> {
  try {
    const release = await lock(chatsFileName, { retries: { retries: 30, minTimeout: 1000 } });
    const chatsFile = await open(chatsFileName);
    const chatsJson = (await chatsFile.readFile()).toString();
    const state = ChatsSchema.parse(JSON.parse(chatsJson));
    await chatsFile.close();
    return [state, release];
  } catch (e) {
    console.log("unable to load chats file");
    // default to empty
    const chats = {};
    await writeChats(chats);
    const release = await lock(chatsFileName, { retries: { retries: 30, minTimeout: 1000 } });
    return [chats, release];
  }
}

export async function writeChats(chats: Chats): Promise<void> {
  return await writeFile(chatsFileName, JSON.stringify(chats));
}
