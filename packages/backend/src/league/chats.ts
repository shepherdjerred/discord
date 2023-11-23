import { Chats, ChatsSchema } from "@glitter-boys/data";
import { writeFile, open } from "fs/promises";
import { lock } from "proper-lockfile";

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
