import { z } from "zod";
import { ChampionSchema } from "./champion.js";
import { PlayerConfigEntrySchema } from "./playerConfigEntry.js";
import { RosterSchema } from "./roster.js";
import { TeamSchema } from "./team.js";
import { LaneSchema } from "./lane.js";
import { RankSchema } from "./rank.js";
import { QueueTypeSchema } from "./state.js";

export type Match = z.infer<typeof MatchSchema>;
export const MatchSchema = z.strictObject({
  durationInSeconds: z.number().nonnegative(),
  queueType: QueueTypeSchema.optional(),
  // this field stores data specific to the player we care about
  player: z.strictObject({
    playerConfig: PlayerConfigEntrySchema,
    wins: z.number().nonnegative(),
    losses: z.number().nonnegative(),
    outcome: z.enum(["Victory", "Defeat", "Surrender"]),
    champion: ChampionSchema,
    team: TeamSchema,
    lane: LaneSchema.optional(),
    laneOpponent: ChampionSchema.optional(),
    rankBeforeMatch: RankSchema.optional(),
    rankAfterMatch: RankSchema,
  }),
  teams: z.strictObject({
    red: RosterSchema,
    blue: RosterSchema,
  }),
});
