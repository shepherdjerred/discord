import { readFile } from "fs/promises";
import { PlayerConfig, PlayerConfigSchema } from "@glitter-boys/data";

const file = new URL("../../../players.json", import.meta.url);

export async function getPlayerConfigs(): Promise<PlayerConfig> {
  const playersJsonString = (await readFile(file)).toString();
  return PlayerConfigSchema.parse(JSON.parse(playersJsonString));
}
