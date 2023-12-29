import { Player, sortPlayersBySoloQueueRank, Leaderboard, getLeaguePointsDelta } from "@glitter-boys/data";
import _ from "lodash";

export function toLeaderboard(players: Player[], doubleXp: Leaderboard): Leaderboard {
  let position = 0;
  let previous: number;

  const playersSorted = sortPlayersBySoloQueueRank(players);

  const entries = _.map(playersSorted, (player) => {
    let leaguePointsDelta = getLeaguePointsDelta(player.config.league.initialRank, player.ranks.solo);

    // find player in the doubelxp leaderboard
    const playerXp = _.find(doubleXp.contents, (entry) => entry.player.config.name === player.config.name);

    if (playerXp === undefined) {
      throw new Error(`Could not find player ${player.config.name} in double xp leaderboard`);
    }

    const doubleXpDelta = Math.max(0, getLeaguePointsDelta(playerXp.player.ranks.solo, player.ranks.solo));
    console.log({
      name: player.config.name,
      checkpoint: playerXp.player.ranks.solo,
      leaguePointsDelta,
      doubleXpDelta,
    });
    leaguePointsDelta += doubleXpDelta;

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
