import { z } from "zod";
import { RankSchema } from "./rank.js";
import { PlayerConfigEntrySchema } from "./playerConfigEntry.js";

export type Player = z.infer<typeof PlayerSchema>;
export const PlayerSchema = z.strictObject({
  config: PlayerConfigEntrySchema,
  currentRank: RankSchema,
});
