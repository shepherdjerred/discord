import { lock } from "proper-lockfile";
import { open, writeFile } from "fs/promises";
import { State, StateSchema } from "@glitter-boys/data";

const stateFileName = "state.json";

export async function getState(): Promise<[State, () => Promise<void>]> {
  try {
    const release = await lock(stateFileName, { retries: { retries: 30, minTimeout: 1000 } });
    const stateFile = await open(stateFileName);
    const stateJson = (await stateFile.readFile()).toString();
    const state = StateSchema.parse(JSON.parse(stateJson));
    await stateFile.close();
    return [state, release];
  } catch (e) {
    console.log("unable to load state file");
    // default to empty state
    const state = {
      gamesStarted: [],
    };
    await writeState(state);
    const release = await lock(stateFileName, { retries: { retries: 30, minTimeout: 1000 } });
    return [state, release];
  }
}

export async function writeState(state: State): Promise<void> {
  return await writeFile(stateFileName, JSON.stringify(state));
}
