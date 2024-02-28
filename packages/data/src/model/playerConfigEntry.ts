// @deno-types="npm:@types/lodash"
import _ from "npm:lodash@4.17.21";
import { z } from "https://esm.sh/zod@3.22.4";
import { LeagueAcccountSchema } from "./leagueAccount.ts";
import { DiscordSchema } from "./discord.ts";

export type PlayerConfigEntry = z.infer<typeof PlayerConfigEntrySchema>;
export const PlayerConfigEntrySchema = z.strictObject({
  name: z.string(),
  league: z.strictObject({
    leagueAccount: LeagueAcccountSchema,
    initialRank: z.unknown().optional(),
  }),
  discordAccount: DiscordSchema,
});
