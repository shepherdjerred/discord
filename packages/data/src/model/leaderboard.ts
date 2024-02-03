import { z } from "zod";
import { PlayerWithSoloQueueRankSchema } from "./player.js";
import { rankToLeaguePoints } from "./leaguePoints.js";

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

// the only difference between the two is the `leaguePointsDelta` field
export type OldLeaderboardEntry = z.infer<typeof OldLeaderboardEntrySchema>;
export const OldLeaderboardEntrySchema = z.strictObject({
  player: PlayerWithSoloQueueRankSchema,
  position: z.number().nonnegative(),
  leaguePointsDelta: z.number(),
});

export type OldLeaderboard = z.infer<typeof OldLeaderboardSchema>;
export const OldLeaderboardSchema = z.strictObject({
  date: z.string().pipe(z.coerce.date()),
  contents: z.array(OldLeaderboardEntrySchema),
});

export function convertOldLeaderboard(oldLeaderboard: OldLeaderboard): Leaderboard {
  return {
    date: oldLeaderboard.date,
    contents: oldLeaderboard.contents.map((entry) => ({
      player: entry.player,
      position: entry.position,
      leaguePoints: rankToLeaguePoints(entry.player.ranks.solo),
    })),
  };
}
