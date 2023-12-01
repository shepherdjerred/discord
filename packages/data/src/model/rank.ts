import { z } from "zod";
import { DivisionSchema, divisionToString } from "./division.js";
import { TierSchema } from "./tier.js";
import _ from "lodash";
import { rankToLeaguePoints, tierToOrdinal } from "./leaguePoints.js";

export type Rank = z.infer<typeof RankSchema>;
export const RankSchema = z.strictObject({
  division: DivisionSchema,
  tier: TierSchema,
  lp: z.number().nonnegative().max(100),
  wins: z.number().nonnegative(),
  losses: z.number().nonnegative(),
});

export type Ranks = z.infer<typeof RanksSchema>;
export const RanksSchema = z.object({
  solo: RankSchema.optional(),
  flex: RankSchema.optional(),
});

export function rankToString(rank: Rank): string {
  return `${_.startCase(rank.tier)} ${divisionToString(rank.division)}, ${rank.lp}LP`;
}

export function rankToSimpleString(rank: Rank): string {
  return `${_.startCase(rank.tier)} ${divisionToString(rank.division)}`;
}

export function wasDemoted(previous: Rank | undefined, current: Rank): boolean {
  if (previous == undefined) {
    return false;
  }

  const previousTier = tierToOrdinal(previous.tier);
  const currentTier = tierToOrdinal(current.tier);
  const previousDivision = previous.division;
  const currentDivision = current.division;

  if (previousTier > currentTier) {
    return true;
  }

  if (previousTier == currentTier && previousDivision < currentDivision) {
    return true;
  }

  return false;
}

export function wasPromoted(previous: Rank | undefined, current: Rank): boolean {
  if (previous == undefined) {
    return false;
  }

  const previousTier = tierToOrdinal(previous.tier);
  const currentTier = tierToOrdinal(current.tier);
  const previousDivision = previous.division;
  const currentDivision = current.division;

  if (previousTier < currentTier) {
    return true;
  }

  if (previousTier == currentTier && previousDivision > currentDivision) {
    return true;
  }

  return false;
}

export function getLeaguePointsDelta(oldRank: Rank, newRank: Rank): number {
  return rankToLeaguePoints(newRank) - rankToLeaguePoints(oldRank);
}
