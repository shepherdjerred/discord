import _ from "lodash";
import { api } from "../api.js";
import { stringToDivision } from "../utils.js";
import { PlayerConfigEntry } from "./config.js";
import { Constants } from "twisted";
import { Rank, TierSchema } from "./rank.js";

export async function getCurrentRank(player: PlayerConfigEntry): Promise<Rank> {
  const response = await api.League.bySummoner(player.league.leagueAccount.id, Constants.Regions.AMERICA_NORTH);
  const soloQueue = _.first(response.response.filter((entry) => entry.queueType === "RANKED_SOLO_5x5"));
  if (!soloQueue) {
    throw new Error("unable to find solo queue");
  }
  return {
    division: stringToDivision(soloQueue.rank),
    tier: TierSchema.parse(soloQueue.tier.toLowerCase()),
    lp: soloQueue.leaguePoints,
    wins: soloQueue.wins,
    losses: soloQueue.losses,
  };
}
