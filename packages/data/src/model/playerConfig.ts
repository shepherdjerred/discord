import { z } from "zod";
import { PlayerConfigEntrySchema } from "./playerConfigEntry.js";

export type PlayerConfig = z.infer<typeof PlayerConfigSchema>;
export const PlayerConfigSchema = z.array(PlayerConfigEntrySchema);
