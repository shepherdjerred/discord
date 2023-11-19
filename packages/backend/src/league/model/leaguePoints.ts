import { match } from "ts-pattern";
import { z } from "zod";
import { numberOfDivisions } from "./division.js";
import { Rank } from "./rank.js";
import { Tier } from "./tier.js";

export type LeaguePoints = z.infer<typeof LeaguePointsSchema>;
export const LeaguePointsSchema = z.number().brand("League Points");

export const leaguePointsPerDivision = 100;

export function rankToLeaguePoints(rank: Rank): LeaguePoints {
  const divisionLp = (numberOfDivisions - rank.division) * leaguePointsPerDivision;
  const tierLp = tierToLeaguePoints(rank.tier);
  return LeaguePointsSchema.parse(divisionLp + tierLp + rank.lp);
}

function tierToLeaguePoints(tier: Tier): LeaguePoints {
  const multiplier = match(tier)
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
  return LeaguePointsSchema.parse(multiplier * numberOfDivisions * leaguePointsPerDivision);
}

export function diffToString(input: number): string {
  if (input <= 0) {
    return input.toLocaleString();
  } else {
    return `+${input.toLocaleString()}`;
  }
}
