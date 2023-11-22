import { z } from "zod";
import { PlayerSchema } from "./player.js";

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
export const LeaderboardEntrySchema = z.strictObject({
  player: PlayerSchema,
  position: z.number().nonnegative(),
  leaguePointsDelta: z.number(),
});

export type Leaderboard = z.infer<typeof LeaderboardSchema>;
export const LeaderboardSchema = z.array(LeaderboardEntrySchema);
