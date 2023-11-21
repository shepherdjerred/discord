import { MatchV5DTOs } from "twisted/dist/models-dto/index.js";
import { z } from "zod";
import { LaneSchema, parseLane } from "./lane.js";

export type Champion = z.infer<typeof ChampionSchema>;
export const ChampionSchema = z.strictObject({
  summonerName: z.string().min(0),
  championName: z.string().min(0),
  kills: z.number().nonnegative(),
  deaths: z.number().nonnegative(),
  assists: z.number().nonnegative(),
  level: z.number().min(1).max(18),
  items: z.array(z.number()),
  lane: LaneSchema.optional(),
  spells: z.array(z.number()),
  gold: z.number().nonnegative(),
  runes: z.array(z.strictObject({})),
  creepScore: z.number().nonnegative(),
  visionScore: z.number().nonnegative(),
  damage: z.number().nonnegative(),
});

export function createChampionObject(dto: MatchV5DTOs.ParticipantDto): Champion {
  const lane = parseLane(dto.teamPosition);

  return {
    summonerName: dto.summonerName,
    championName: dto.championName,
    kills: dto.kills,
    deaths: dto.deaths,
    assists: dto.assists,
    // TODO translate these to item names
    items: [dto.item0, dto.item1, dto.item2, dto.item3, dto.item4, dto.item5, dto.item6],
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
