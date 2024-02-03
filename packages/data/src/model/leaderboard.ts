import { z } from "zod";
import { PlayerWithSoloQueueRankSchema } from "./player.js";

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
export const LeaderboardEntrySchema = z.strictObject({
  player: PlayerWithSoloQueueRankSchema,
  position: z.number().nonnegative(),
  leaguePoints: z.number(),
});

export type Leaderboard = z.infer<typeof LeaderboardSchema>;
export const LeaderboardSchema = z.strictObject({
  date: z.string().pipe(z.coerce.date()),
  contents: z.array(LeaderboardEntrySchema),
});
