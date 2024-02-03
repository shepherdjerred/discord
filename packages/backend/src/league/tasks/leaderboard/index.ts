import { Player, sortPlayersBySoloQueueRank, Leaderboard, rankToLeaguePoints } from "@glitter-boys/data";
import _ from "lodash";

export function toLeaderboard(players: Player[]): Leaderboard {
  let position = 0;
  let previous: number;

  const playersSorted = sortPlayersBySoloQueueRank(players);

  const entries = _.map(playersSorted, (player) => {
    const leaguePoints = rankToLeaguePoints(player.ranks.solo);

    // account for ties
    if (leaguePoints !== previous) {
      position++;
    }

    return {
      player,
      leaguePoints,
      position,
    };
  });

  return {
    date: new Date(),
    contents: entries,
  };
}
