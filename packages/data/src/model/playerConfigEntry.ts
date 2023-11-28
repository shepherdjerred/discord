// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";
import { z } from "https://esm.sh/zod";
import { DiscordSchema } from "https://esm.sh/discord.js";
import { LeagueAcccountSchema } from "./leagueAccount.ts";
import { RankSchema } from "./rank.ts";

export type PlayerConfigEntry = z.infer<typeof PlayerConfigEntrySchema>;
export const PlayerConfigEntrySchema = z.strictObject({
  name: z.string(),
  league: z.strictObject({
    leagueAccount: LeagueAcccountSchema,
    initialRank: RankSchema,
  }),
  discordAccount: DiscordSchema,
});
