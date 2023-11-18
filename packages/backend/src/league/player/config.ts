import { z } from "zod";
import { LeagueAcccountSchema, RankSchema, DiscordSchema } from "./player.js";
import { open } from "fs/promises";

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
