import { z } from "zod";
import { PlayerConfigEntrySchema } from "./config.js";
import { RankSchema } from "./rank.js";

export type Player = z.infer<typeof PlayerSchema>;
export const PlayerSchema = z.strictObject({
  config: PlayerConfigEntrySchema,
  currentRank: RankSchema,
});
