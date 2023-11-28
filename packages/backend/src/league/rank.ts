import { parseDivision } from "@glitter-boys/data";
import { PlayerConfigEntry } from "@glitter-boys/data";
import { Rank } from "@glitter-boys/data";
import { TierSchema } from "@glitter-boys/data";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";
import { api } from "./api/api.ts";
import { Constants } from "https://esm.sh/twisted";

export async function getCurrentRank(player: PlayerConfigEntry): Promise<Rank> {
  const response = await api.League.bySummoner(
    player.league.leagueAccount.id,
    Constants.Regions.AMERICA_NORTH
  );
  const soloQueue = _.chain(response.response)
    .filter((entry) => entry.queueType === "RANKED_SOLO_5x5")
    .first()
    .value();
  if (!soloQueue) {
    throw new Error(
      `unable to find solo queue: ${JSON.stringify(response.response)}`
    );
  }
  const division = parseDivision(soloQueue.rank);
  if (division === undefined) {
    throw new Error(
      `unable to find division, ${JSON.stringify(soloQueue.rank)}`
    );
  }
  return {
    division,
    tier: TierSchema.parse(soloQueue.tier.toLowerCase()),
    lp: soloQueue.leaguePoints,
    wins: soloQueue.wins,
    losses: soloQueue.losses,
  };
}
