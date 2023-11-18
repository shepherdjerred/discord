import { z } from "zod";
import { open } from "fs/promises";
import { RankSchema } from "./rank.js";

export type Discord = z.infer<typeof DiscordSchema>;
export const DiscordSchema = z.strictObject({
  id: z.string().min(0),
});

export type LeagueAccount = z.infer<typeof LeagueAcccountSchema>;
export const LeagueAcccountSchema = z.strictObject({
  // AKA encrypted summoner ID
  id: z.string().min(0),
  accountId: z.string().min(0),
  puuid: z.string().min(0),
});

export type PlayerConfigEntry = z.infer<typeof PlayerConfigEntrySchema>;
export const PlayerConfigEntrySchema = z.strictObject({
  name: z.string(),
  league: z.strictObject({
    leagueAccount: LeagueAcccountSchema,
    initialRank: RankSchema,
  }),
  discordAccount: DiscordSchema,
});

export type PlayerConfig = z.infer<typeof PlayerConfigSchema>;
export const PlayerConfigSchema = z.array(PlayerConfigEntrySchema);

export async function loadPlayers(): Promise<PlayerConfig> {
  const file = await open("players.json");
  const playersJson = (await file.readFile()).toString();
  await file.close();
  return PlayerConfigSchema.parse(JSON.parse(playersJson));
}
