import { z } from "https://esm.sh/zod@3.22.4";
import { RankSchema } from "./rank.ts";
import { PlayerConfigEntrySchema } from "./playerConfigEntry.ts";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";
import { rankToLeaguePoints } from "./leaguePoints.ts";

export type Player = z.infer<typeof PlayerSchema>;
export const PlayerSchema = z.strictObject({
  config: PlayerConfigEntrySchema,
  currentRank: RankSchema,
});

export function getLeaguePointsDelta(player: Player) {
  return (
    rankToLeaguePoints(player.currentRank) -
    rankToLeaguePoints(player.config.league.initialRank)
  );
}

export function sortPlayers(players: Player[]) {
  return _.chain(players).sortBy(getLeaguePointsDelta).reverse().value();
}
