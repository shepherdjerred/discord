import { z } from "zod";
import { RankSchema } from "./rank.js";
import { PlayerConfigEntry, PlayerConfigEntrySchema, getCurrentRank } from "./playerConfigEntry.js";
import _ from "lodash";
import { rankToLeaguePoints } from "./leaguePoints.js";

export type Player = z.infer<typeof PlayerSchema>;
export const PlayerSchema = z.strictObject({
  config: PlayerConfigEntrySchema,
  currentRank: RankSchema,
});

export function getLeaguePointsDelta(player: Player) {
  return rankToLeaguePoints(player.currentRank) - rankToLeaguePoints(player.config.league.initialRank);
}

export async function getPlayer(playerConfig: PlayerConfigEntry): Promise<Player> {
  const currentRank = await getCurrentRank(playerConfig);
  return {
    config: playerConfig,
    currentRank: currentRank,
  };
}
export function sortPlayers(players: Player[]) {
  return _.chain(players).sortBy(getLeaguePointsDelta).reverse().value();
}
