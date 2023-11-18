import _ from "lodash";
import { MatchV5DTOs } from "twisted/dist/models-dto/index.js";
import { z } from "zod";
import { PlayerConfigEntrySchema, PlayerConfigEntry } from "../model/playerConfigEntry.js";

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
  damage: z.number().nonnegative(),
});

export type Match = z.infer<typeof MatchSchema>;
export const MatchSchema = z.strictObject({
  player: PlayerConfigEntrySchema,
  name: z.string().min(0),
  cs: z.number().nonnegative(),
  vs: z.number().nonnegative(),
  lp: z.number(),
  champion: z.string().min(0),
  damage: z.number().nonnegative(),
  outcome: z.enum(["Victory", "Defeat", "Surrender"]),
  duration: z.number().nonnegative(),
  teams: z.record(z.union([z.literal("red"), z.literal("blue")]), z.array(ChampionSchema).length(5)),
});

export function createMatchObject(username: string, player: PlayerConfigEntry, dto: MatchV5DTOs.MatchDto): Match {
  const playerParticipant = _.chain(dto.info.participants)
    .filter((participant) => participant.puuid === player.league.leagueAccount.puuid)
    .first()
    .value();

  if (playerParticipant == undefined) {
    console.error("invalid state");
    throw Error("");
  }

  let outcome: "Victory" | "Defeat" | "Surrender";
  if (playerParticipant.win) {
    outcome = "Victory";
  } else if (playerParticipant.gameEndedInSurrender) {
    outcome = "Surrender";
  } else {
    outcome = "Defeat";
  }

  return {
    player,
    name: username,
    cs: playerParticipant.totalMinionsKilled + playerParticipant.neutralMinionsKilled,
    vs: playerParticipant.visionScore,
    lp: 0,
    damage: playerParticipant.totalDamageDealtToChampions,
    champion: playerParticipant.championName,
    outcome,
    duration: dto.info.gameDuration,
    teams: {
      blue: _.map(dto.info.participants.slice(0, 5), createChampionObject),
      red: _.map(dto.info.participants.slice(5, 10), createChampionObject),
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
    damage: dto.totalDamageDealtToChampions,
  };
}
