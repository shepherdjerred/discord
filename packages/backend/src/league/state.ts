import { z } from "zod";
import { lock } from "proper-lockfile";
import { open, writeFile } from "fs/promises";
import { PlayerConfigSchema } from "./player.js";

const stateFileName = "state.json";

export async function loadState(): Promise<[State, () => Promise<void>]> {
  const release = await lock(stateFileName);
  const stateFile = await open(stateFileName);
  const stateJson = (await stateFile.readFile()).toString();
  const state = StateSchema.parse(JSON.parse(stateJson));
  await stateFile.close();
  return [state, release];
}

export async function writeState(state: State): Promise<void> {
  return await writeFile(stateFileName, JSON.stringify(state));
}

export type GameState = z.infer<typeof GameStateSchema>;
export const GameStateSchema = z.object({
  uuid: z.string(),
  date: z.string().pipe(z.coerce.date()),
  id: z.number(),
  player: PlayerConfigSchema,
});

export type State = z.infer<typeof StateSchema>;
// call the SPECTATOR endpoint every minute
// if a player is in a game, and that game is not in `gamesStarted`, post a message and add to `gamesStarted`
// iterate through `gamesStarted`:
// for each game, check if the MATCH endpoint has data
// if it has data, send a message to Discord and remove the game from `gamesStarted`
// remove any old games from `gamesStarted`
//
// post the leaderboard update only once a day.
export const StateSchema = z.object({
  gamesStarted: z.array(GameStateSchema),
});
