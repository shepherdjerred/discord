import { match, P } from "ts-pattern";
import { z } from "zod";
import { numberOfDivisions } from "./division.js";
import { Rank } from "./rank.js";
import { Tier } from "./tier.js";

export type LeaguePoints = z.infer<typeof LeaguePointsSchema>;
export const LeaguePointsSchema = z.number().brand("League Points");

export const leaguePointsPerDivision = 100;

export function leaguePointsDelta(oldRank: Rank, newRank: Rank): LeaguePoints {
  return LeaguePointsSchema.parse(rankToLeaguePoints(newRank) - rankToLeaguePoints(oldRank));
}

export function rankToLeaguePoints(rank: Rank): LeaguePoints {
  const divisionLp = (numberOfDivisions - rank.division) * leaguePointsPerDivision;
  const tierLp = tierToLeaguePoints(rank.tier);
  return LeaguePointsSchema.parse(divisionLp + tierLp + rank.lp);
}

export function tierToOrdinal(tier: Tier): number {
  return match(tier)
    .with("iron", () => 0)
    .with("bronze", () => 1)
    .with("silver", () => 2)
    .with("gold", () => 3)
    .with("platinum", () => 4)
    .with("emerald", () => 5)
    .with("diamond", () => 6)
    .with("master", () => 7)
    .with("grandmaster", () => 8)
    .with("challenger", () => 9)
    .exhaustive();
}

function tierToLeaguePoints(tier: Tier): LeaguePoints {
  const multiplier = tierToOrdinal(tier);
  return LeaguePointsSchema.parse(multiplier * numberOfDivisions * leaguePointsPerDivision);
}

export function lpDiffToString(input: number): string {
  return match(input)
    .with(P.number.negative(), () => `${input.toLocaleString()} LP`)
    .with(0, () => "-")
    .with(P.number.positive(), () => `+${input.toLocaleString()} LP`)
    .run();
}
