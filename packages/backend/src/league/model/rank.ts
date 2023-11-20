import { z } from "zod";
import { DivisionSchema, divisionToString } from "./division.js";
import { TierSchema } from "./tier.js";
import _ from "lodash";

export type Rank = z.infer<typeof RankSchema>;
export const RankSchema = z.strictObject({
  division: DivisionSchema,
  tier: TierSchema,
  lp: z.number().nonnegative().max(100),
  wins: z.number().nonnegative(),
  losses: z.number().nonnegative(),
});

export function rankToString(rank: Rank): string {
  return `${_.startCase(rank.tier)} ${divisionToString(rank.division)}, ${rank.lp}LP`;
}
