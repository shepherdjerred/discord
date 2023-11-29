import { Ranks, parseDivision } from "@glitter-boys/data";
import { PlayerConfigEntry } from "@glitter-boys/data";
import { Rank } from "@glitter-boys/data";
import { TierSchema } from "@glitter-boys/data";
import _ from "lodash";
import { api } from "../api/api.js";
import { Constants } from "twisted";
import { SummonerLeagueDto } from "twisted/dist/models-dto/index.js";
import assert from "assert";

const solo = "RANKED_SOLO_5x5";
const flex = "RANKED_TEAM_5x5";

export function getDto(dto: SummonerLeagueDto[], queue: string): SummonerLeagueDto {
  return _.chain(dto)
    .filter((entry) => entry.queueType === queue)
    .first()
    .value();
}

export function getRank(dto: SummonerLeagueDto[], queue: string): Rank {
  const entry = getDto(dto, queue);
  const division = parseDivision(entry.rank);
  assert(division !== undefined);

  return {
    division,
    tier: TierSchema.parse(entry.tier.toLowerCase()),
    lp: entry.leaguePoints,
    wins: entry.wins,
    losses: entry.losses,
  };
}

export async function getRanks(player: PlayerConfigEntry): Promise<Ranks> {
  const response = await api.League.bySummoner(player.league.leagueAccount.id, Constants.Regions.AMERICA_NORTH);

  return {
    solo: getRank(response.response, solo),
    flex: getRank(response.response, flex),
  };
}
