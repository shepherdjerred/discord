import { open } from "fs/promises";
import { PlayerConfig, PlayerConfigSchema } from "@glitter-boys/data";

export async function getPlayerConfigs(): Promise<PlayerConfig> {
  const file = await open("players.json");
  const playersJson = (await file.readFile()).toString();
  await file.close();
  return PlayerConfigSchema.parse(JSON.parse(playersJson));
}
