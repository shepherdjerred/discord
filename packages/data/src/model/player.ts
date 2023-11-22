import { z } from "zod";
import { RankSchema } from "./rank.js";
import { PlayerConfigEntrySchema } from "./playerConfigEntry.js";
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

export function sortPlayers(players: Player[]) {
  return _.chain(players).sortBy(getLeaguePointsDelta).reverse().value();
}
