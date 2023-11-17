import { z } from "zod";
import { PlayerConfigSchema } from "./model.js";

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
