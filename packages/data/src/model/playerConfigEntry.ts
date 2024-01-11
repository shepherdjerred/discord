import { z } from "zod";
import { DiscordSchema } from "./discord.js";
import { LeagueAcccountSchema } from "./leagueAccount.js";
import { RankSchema } from "./rank.js";

export type PlayerConfigEntry = z.infer<typeof PlayerConfigEntrySchema>;
export const PlayerConfigEntrySchema = z.strictObject({
  name: z.string(),
  league: z.strictObject({
    leagueAccount: LeagueAcccountSchema,
    initialRank: RankSchema,
  }),
  discordAccount: DiscordSchema,
});
