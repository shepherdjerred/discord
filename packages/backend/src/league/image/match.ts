import _ from "lodash";
import { MatchV5DTOs } from "twisted/dist/models-dto/index.js";
import { z } from "zod";

export type Champion = z.infer<typeof ChampionSchema>;
export const ChampionSchema = z.strictObject({
  champion: z.string().min(0),
  kills: z.number().nonnegative(),
  deaths: z.number().nonnegative(),
  assists: z.number().nonnegative(),
  items: z.array(z.object({})),
  spells: z.array(z.object({})),
  runes: z.array(z.object({})),
  cs: z.number().nonnegative(),
  vs: z.number().nonnegative(),
  lane: z.enum(["top", "jg", "mid", "adc", "sup"]),
});

export type Match = z.infer<typeof MatchSchema>;
export const MatchSchema = z.strictObject({
  outcome: z.enum(["win", "loss"]),
  duration: z.number().nonnegative(),
  teams: z.record(z.union([z.literal("red"), z.literal("blue")]), z.array(ChampionSchema).length(5)),
});

export function createMatchObject(dto: MatchV5DTOs.MatchDto): Match {
  return {
    outcome: "win",
    duration: dto.info.gameDuration,
    teams: {
      red: _.map(dto.info.participants.slice(0, 5), createChampionObject),
      blue: _.map(dto.info.participants.slice(5, 10), createChampionObject),
    },
  };
}

export function createChampionObject(dto: MatchV5DTOs.ParticipantDto): Champion {
  return {
    champion: dto.championName,
    kills: dto.kills,
    deaths: dto.deaths,
    assists: dto.assists,
    items: [dto.item0, dto.item1, dto.item2, dto.item3, dto.item4, dto.item5, dto.item6],
    spells: [dto.summoner1Id, dto.summoner2Id],
    runes: [],
    lane: dto.teamPosition.toLowerCase() as Champion["lane"],
    cs: dto.totalMinionsKilled + dto.neutralMinionsKilled,
    vs: dto.visionScore,
  };
}
