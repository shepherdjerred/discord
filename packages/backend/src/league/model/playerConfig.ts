import { readFile } from "fs/promises";
import { PlayerConfig, PlayerConfigSchema } from "@glitter-boys/data";

export async function getPlayerConfigs(): Promise<PlayerConfig> {
  const playersJsonString = (await readFile("players.json")).toString();
  return PlayerConfigSchema.parse(JSON.parse(playersJsonString));
}
