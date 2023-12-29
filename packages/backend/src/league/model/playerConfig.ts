import { readFile } from "fs/promises";
import { Leaderboard, LeaderboardSchema, PlayerConfig, PlayerConfigSchema } from "@glitter-boys/data";

const file = new URL("../../../players.json", import.meta.url);
const doubleXpFile = new URL("../../../double-xp.json", import.meta.url);

export async function getPlayerConfigs(): Promise<PlayerConfig> {
  const playersJsonString = (await readFile(file)).toString();
  return PlayerConfigSchema.parse(JSON.parse(playersJsonString));
}

export async function getDoubleXp(): Promise<Leaderboard> {
  const jsonString = (await readFile(doubleXpFile)).toString();
  return LeaderboardSchema.parse(JSON.parse(jsonString));
}
