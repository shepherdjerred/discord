import { z } from "https://esm.sh/zod";
import { ChampionSchema } from "./champion.ts";

export type Roster = z.infer<typeof RosterSchema>;
export const RosterSchema = z.array(ChampionSchema).length(5);
