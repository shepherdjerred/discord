import { z } from "zod";
import { OldPlayerSchema, convertOldPlayer } from "./oldPlayer.js";
import { Leaderboard } from "../leaderboard.js";
import _ from "lodash";

export type OldLeaderboardEntry = z.infer<typeof OldLeaderboardEntrySchema>;
export const OldLeaderboardEntrySchema = z.strictObject({
  player: OldPlayerSchema,
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
    contents: _.map(oldLeaderboard.contents, (entry) => ({
      player: convertOldPlayer(entry.player),
      position: entry.position,
      leaguePointsDelta: entry.leaguePointsDelta,
    })),
  };
}
