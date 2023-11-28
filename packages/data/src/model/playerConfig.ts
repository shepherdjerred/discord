import { z } from "https://esm.sh/zod@3.22.4";
import { PlayerConfigEntrySchema } from "./playerConfigEntry.ts";

export type PlayerConfig = z.infer<typeof PlayerConfigSchema>;
export const PlayerConfigSchema = z.array(PlayerConfigEntrySchema);
