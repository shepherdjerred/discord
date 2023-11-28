import {
  Player,
  sortPlayers,
  getLeaguePointsDelta,
  Leaderboard,
} from "@glitter-boys/data";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";

export function toLeaderboard(players: Player[]): Leaderboard {
  let position = 0;
  let previous: number;

  const playersSorted = sortPlayers(players);

  const entries = _.map(playersSorted, (player) => {
    const leaguePointsDelta = getLeaguePointsDelta(player);

    // account for ties
    if (leaguePointsDelta !== previous) {
      position++;
    }

    return {
      player,
      leaguePointsDelta,
      position,
    };
  });

  return {
    date: new Date(),
    contents: entries,
  };
}
