import { z } from "https://esm.sh/zod@3.22.4";
import { PlayerConfigSchema } from "./playerConfig.ts";

export type Instance = z.infer<typeof InstanceSchema>;
export const InstanceSchema = z.strictObject({
  guildId: z.string(),
  leaderboardRoleId: z.string(),
  leagueChannelId: z.string(),
  playerConfig: PlayerConfigSchema,
});
