import { z } from "zod";
import { Rank, RanksSchema } from "./rank.js";
import { PlayerConfigEntrySchema } from "./playerConfigEntry.js";
import _ from "lodash";
import { rankToLeaguePoints } from "./leaguePoints.js";

export type Player = z.infer<typeof PlayerSchema>;
export const PlayerSchema = z.strictObject({
  config: PlayerConfigEntrySchema,
  ranks: RanksSchema,
});

export function getLeaguePointsDelta(oldRank: Rank, newRank: Rank) {
  return rankToLeaguePoints(oldRank) - rankToLeaguePoints(newRank);
}

export function getSoloQueueLeaguePointsDelta(player: Player) {
  return getLeaguePointsDelta(player.config.league.initialRank, player.ranks.solo);
}

export function sortPlayersBySoloQueueRank(players: Player[]) {
  return _.chain(players).sortBy(getSoloQueueLeaguePointsDelta).reverse().value();
}
