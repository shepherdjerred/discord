import { Champion } from "@glitter-boys/data";
import { parseLane } from "@glitter-boys/data";
import { MatchV5DTOs } from "npm:twisted@1.55.0/dist/models-dto/index.js";

export function createChampionObject(
  dto: MatchV5DTOs.ParticipantDto,
): Champion {
  const lane = parseLane(dto.teamPosition);

  return {
    summonerName: dto.summonerName,
    championName: dto.championName,
    kills: dto.kills,
    deaths: dto.deaths,
    assists: dto.assists,
    // TODO translate these to item names
    items: [
      dto.item0,
      dto.item1,
      dto.item2,
      dto.item3,
      dto.item4,
      dto.item5,
      dto.item6,
    ],
    // TODO translate these to spell names
    spells: [dto.summoner1Id, dto.summoner2Id],
    runes: [],
    lane,
    creepScore: dto.totalMinionsKilled + dto.neutralMinionsKilled,
    visionScore: dto.visionScore,
    damage: dto.totalDamageDealtToChampions,
    gold: dto.goldEarned,
    level: dto.champLevel,
  };
}
