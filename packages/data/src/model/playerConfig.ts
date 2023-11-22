import { z } from "zod";
import { open } from "fs/promises";
import { PlayerConfigEntrySchema } from "./playerConfigEntry.js";

export type PlayerConfig = z.infer<typeof PlayerConfigSchema>;
export const PlayerConfigSchema = z.array(PlayerConfigEntrySchema);

export async function getPlayerConfigs(): Promise<PlayerConfig> {
  const file = await open("players.json");
  const playersJson = (await file.readFile()).toString();
  await file.close();
  return PlayerConfigSchema.parse(JSON.parse(playersJson));
}
