import { z } from "zod";
import { PlayerConfigEntrySchema } from "./config.js";

export type Tier = z.infer<typeof TierSchema>;
export const TierSchema = z.enum([
  "iron",
  "bronze",
  "silver",
  "gold",
  "platinum",
  "emerald",
  "diamond",
  "master",
  "grandmaster",
  "challenger",
]);

export const numberOfDivisions = 4;
export type Division = z.infer<typeof DivisionSchema>;
export const DivisionSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);

export type Rank = z.infer<typeof RankSchema>;
export const RankSchema = z.strictObject({
  division: DivisionSchema,
  tier: TierSchema,
  lp: z.number().nonnegative().max(100),
  wins: z.number().nonnegative(),
  losses: z.number().nonnegative(),
});

export type Player = z.infer<typeof PlayerSchema>;
export const PlayerSchema = z.strictObject({
  config: PlayerConfigEntrySchema,
  currentRank: RankSchema,
});

export type LeagueAccount = z.infer<typeof LeagueAcccountSchema>;
export const LeagueAcccountSchema = z.strictObject({
  // AKA encrypted summoner ID
  id: z.string().min(0),
  accountId: z.string().min(0),
  puuid: z.string().min(0),
});

export type Discord = z.infer<typeof DiscordSchema>;
export const DiscordSchema = z.strictObject({
  id: z.string().min(0),
});
