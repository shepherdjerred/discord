import { z } from "zod";
import { DiscordSchema } from "./discord.js";
import { LeagueAcccountSchema } from "./leagueAccount.js";

export type PlayerConfigEntry = z.infer<typeof PlayerConfigEntrySchema>;
export const PlayerConfigEntrySchema = z.strictObject({
  name: z.string(),
  league: z.strictObject({
    leagueAccount: LeagueAcccountSchema,
    initialRank: z.unknown().optional(),
  }),
  discordAccount: DiscordSchema,
});
