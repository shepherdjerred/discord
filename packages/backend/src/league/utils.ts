import { match } from "ts-pattern";
import { Tier, Rank, Division, numDivisions } from "./model.js";

export function tierToLp(tier: Tier): number {
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
  return multiplier * 400;
}

export function rankToLp(rank: Rank): number {
  const divisionLp = (numDivisions - rank.division) * 100;
  const tierLp = tierToLp(rank.tier);
  return divisionLp + tierLp + rank.lp;
}

export function stringToDivision(input: string): Division {
  return match(input)
    .returnType<Division>()
    .with("IV", () => 4)
    .with("III", () => 3)
    .with("II", () => 2)
    .with("I", () => 1)
    .run();
}
