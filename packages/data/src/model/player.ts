import { z } from "https://esm.sh/zod@3.22.4";
import { RankSchema } from "./rank.ts";
import { PlayerConfigEntrySchema } from "./playerConfigEntry.ts";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash@4.17.21";
import { rankToLeaguePoints } from "./leaguePoints.ts";

export type Player = z.infer<typeof PlayerSchema>;
export const PlayerSchema = z.strictObject({
  config: PlayerConfigEntrySchema,
  ranks: RanksSchema,
});

<<<<<<< HEAD
export function getLeaguePointsDelta(player: Player) {
  return (
    rankToLeaguePoints(player.currentRank) -
    rankToLeaguePoints(player.config.league.initialRank)
  );
||||||| 1e5c8ed
export function getLeaguePointsDelta(player: Player) {
  return rankToLeaguePoints(player.currentRank) - rankToLeaguePoints(player.config.league.initialRank);
=======
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
>>>>>>> main
}

export function sortPlayersBySoloQueueRank(players: Player[]): PlayerWithSoloQueueRank[] {
  const playersWithSoloQueueRank = filterPlayersWithSoloQueueRank(players);
  return _.chain(playersWithSoloQueueRank)
    .sortBy((player) => rankToLeaguePoints(player.ranks.solo))
    .reverse()
    .value();
}
