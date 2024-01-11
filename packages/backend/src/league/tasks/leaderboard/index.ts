import { Player, sortPlayersBySoloQueueRank, Leaderboard, getLeaguePointsDelta } from "@glitter-boys/data";
import _ from "lodash";

export function toLeaderboard(players: Player[]): Leaderboard {
  let position = 0;
  let previous: number;

  const playersSorted = sortPlayersBySoloQueueRank(players);

  const entries = _.map(playersSorted, (player) => {
    const leaguePointsDelta = getLeaguePointsDelta(player.config.league.initialRank, player.ranks.solo);

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
