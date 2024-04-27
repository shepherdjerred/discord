import { Player } from "../../../../data/src/mod.ts";
import { PlayerConfigEntry } from "../../../../data/src/mod.ts";
import { getRanks } from "./rank.ts";

export async function getPlayer(
  playerConfig: PlayerConfigEntry,
): Promise<Player> {
  return {
    config: playerConfig,
    ranks: await getRanks(playerConfig),
  };
}
