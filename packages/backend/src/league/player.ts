import { z } from "zod";
import { open } from "fs/promises";

export const numDivisions = 4;

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
export const PlayerSchema = z.object({
  name: z.string(),
  discordId: z.string().min(0),
  startingRank: RankSchema,
  rank: RankSchema,
});

export type PlayerConfig = z.infer<typeof PlayerConfigSchema>;
export const PlayerConfigSchema = z.object({
  name: z.string(),
  league: z.object({
    // AKA encrypted summoner ID
    id: z.string().min(0),
    accountId: z.string().min(0),
    puuid: z.string().min(0),
  }),
  discordId: z.string().min(0),
  startingRank: RankSchema,
});

export type PlayersConfig = z.infer<typeof PlayersConfigSchema>;
export const PlayersConfigSchema = z.array(PlayerConfigSchema);

export const Checkpoint = z.object({
  time: z.date(),
  data: z.array(PlayerSchema),
});

export async function loadPlayers(): Promise<PlayersConfig> {
  const file = await open("players.json");
  const playersJson = (await file.readFile()).toString();
  await file.close();
  return PlayersConfigSchema.parse(JSON.parse(playersJson));
}
