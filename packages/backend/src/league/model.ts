import { z } from "zod";

export const numDivisions = 4;

export type Queue = z.infer<typeof QueueSchema>;
export const QueueSchema = z.enum(["solo", "flex"]);

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

export type Outcome = z.infer<typeof OutcomeSchema>;
export const OutcomeSchema = z.enum(["victory", "defeat"]);

export type Match = z.infer<typeof MatchSchema>;
export const MatchSchema = z.strictObject({
  outcome: OutcomeSchema,
});

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

export type LeagueOfLegends = z.infer<typeof LeagueOfLegendsSchema>;
export const LeagueOfLegendsSchema = z.strictObject({
  username: z.string().min(0),
});

export type Player = z.infer<typeof PlayerSchema>;
export const PlayerSchema = z.object({
  discordId: z.string().min(0),
  startingRank: RankSchema,
  rank: RankSchema,
});

export type PlayerConfig = z.infer<typeof PlayerConfigSchema>;
export const PlayerConfigSchema = z.object({
  league: z.object({
    // AKA encrypted summoner ID
    id: z.string().min(0),
    accountId: z.string().min(0),
    puuid: z.string().min(0),
  }),
  discordId: z.string().min(0),
  startingRank: RankSchema,
});

export const PlayersConfigSchema = z.array(PlayerConfigSchema);

export const Checkpoint = z.object({
  time: z.date(),
  data: z.array(PlayerSchema),
});
