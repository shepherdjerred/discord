import { z } from "zod";
import { Player, PlayerSchema, getLeaguePointsDelta, sortPlayers } from "../../model/player.js";
import _ from "lodash";

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
export const LeaderboardEntrySchema = z.strictObject({
  player: PlayerSchema,
  position: z.number().nonnegative(),
  leaguePointsDelta: z.number(),
});

export type Leaderboard = z.infer<typeof LeaderboardSchema>;
export const LeaderboardSchema = z.array(LeaderboardEntrySchema);

export function toLeaderboard(players: Player[]): Leaderboard {
  let position = 0;
  let previous: number;

  const playersSorted = sortPlayers(players);

  return _.map(playersSorted, (player) => {
    const leaguePointsDelta = getLeaguePointsDelta(player);

    // account for ties
    if (leaguePointsDelta !== previous) {
      position++;
    }

    return {
      player,
      leaguePointsDelta,
      position,
    };
  });
}
