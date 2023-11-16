import { z } from "zod";

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

export type Rank = z.infer<typeof RankSchema>;
export const RankSchema = z.strictObject({
  division: z.number(),
  tier: TierSchema,
  lp: z.number(),
  wins: z.number().nonnegative(),
  losses: z.number().nonnegative(),
});

export type LeagueOfLegends = z.infer<typeof LeagueOfLegendsSchema>;
export const LeagueOfLegendsSchema = z.strictObject({
  username: z.string().min(0),
});

export type Player = z.infer<typeof PlayerSchema>;
export const PlayerSchema = z.object({
  discordId: z.string(),
  startingRank: RankSchema,
  rank: RankSchema,
});

export const PlayerConfigSchema = z.object({
  league: z.object({
    id: z.string(),
    accountId: z.string(),
    puuid: z.string(),
  }),
  discordId: z.string(),
  startingRank: RankSchema,
});

export const PlayersConfigSchema = z.array(PlayerConfigSchema);

export const Checkpoint = z.object({
  time: z.date(),
  data: z.array(PlayerSchema),
});
