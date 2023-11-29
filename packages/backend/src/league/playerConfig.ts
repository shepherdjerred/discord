import { PlayerConfig, PlayerConfigSchema } from "@glitter-boys/data";

export async function getPlayerConfigs(): Promise<PlayerConfig> {
  const playersJson = await Deno.readTextFile("players.json");
  return PlayerConfigSchema.parse(JSON.parse(playersJson));
}
