import { z } from "https://esm.sh/zod";
import { PlayerConfigEntrySchema } from "./playerConfigEntry.ts";

export type PlayerConfig = z.infer<typeof PlayerConfigSchema>;
export const PlayerConfigSchema = z.array(PlayerConfigEntrySchema);
