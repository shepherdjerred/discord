import { z } from "zod";
import { RankSchema, RanksSchema, getLeaguePointsDelta } from "./rank.js";
import { PlayerConfigEntrySchema } from "./playerConfigEntry.js";
import _ from "lodash";

export type Player = z.infer<typeof PlayerSchema>;
export const PlayerSchema = z.strictObject({
  config: PlayerConfigEntrySchema,
  ranks: RanksSchema,
});

export type PlayerWithSoloQueueRank = z.infer<typeof PlayerWithSoloQueueRankSchema>;
export const PlayerWithSoloQueueRankSchema = PlayerSchema.extend({
  ranks: RanksSchema.extend({
    solo: RankSchema,
  }),
});

export function filterPlayersWithSoloQueueRank(players: Player[]): PlayerWithSoloQueueRank[] {
  return _.chain(players)
    .flatMap((player) => (player.ranks.solo ? [player as PlayerWithSoloQueueRank] : []))
    .value();
}

export function sortPlayersBySoloQueueRank(players: Player[]): PlayerWithSoloQueueRank[] {
  const playersWithSoloQueueRank = filterPlayersWithSoloQueueRank(players);
  return _.chain(playersWithSoloQueueRank)
    .sortBy((player) => getLeaguePointsDelta(player.config.league.initialRank, player.ranks.solo))
    .reverse()
    .value();
}
