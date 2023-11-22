import { Player } from "@glitter-boys/data";
import { PlayerConfigEntry } from "@glitter-boys/data";
import { getCurrentRank } from "./rank.js";

export async function getPlayer(playerConfig: PlayerConfigEntry): Promise<Player> {
  const currentRank = await getCurrentRank(playerConfig);
  return {
    config: playerConfig,
    currentRank: currentRank,
  };
}
