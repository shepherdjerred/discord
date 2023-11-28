// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";
import { z } from "https://esm.sh/zod";
import { ChampionSchema } from "./champion.ts";
import { PlayerConfigEntrySchema } from "./playerConfigEntry.ts";
import { RosterSchema } from "./roster.ts";
import { TeamSchema } from "./team.ts";
import { LaneSchema } from "./lane.ts";

export type Match = z.infer<typeof MatchSchema>;
export const MatchSchema = z.strictObject({
  durationInSeconds: z.number().nonnegative(),
  // this field stores data specific to the player we care about
  player: z.strictObject({
    playerConfig: PlayerConfigEntrySchema,
    leaguePointsDelta: z.number(),
    tournamentWins: z.number().nonnegative(),
    tournamentLosses: z.number().nonnegative(),
    outcome: z.enum(["Victory", "Defeat", "Surrender"]),
    champion: ChampionSchema,
    team: TeamSchema,
    lane: LaneSchema.optional(),
    laneOpponent: ChampionSchema.optional(),
  }),
  teams: z.strictObject({
    red: RosterSchema,
    blue: RosterSchema,
  }),
});
