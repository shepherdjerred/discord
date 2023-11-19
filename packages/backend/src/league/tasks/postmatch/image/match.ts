import _ from "lodash";
import { MatchV5DTOs } from "twisted/dist/models-dto/index.js";
import { z } from "zod";
import { PlayerConfigEntrySchema } from "../../../model/playerConfigEntry.js";
import { LaneSchema, parseLane } from "../../../model/lane.js";
import { Player } from "../../../model/player.js";

export type Champion = z.infer<typeof ChampionSchema>;
export const ChampionSchema = z.strictObject({
  summonerName: z.string().min(0),
  champion: z.string().min(0),
  kills: z.number().nonnegative(),
  deaths: z.number().nonnegative(),
  assists: z.number().nonnegative(),
  level: z.number().min(1).max(18),
  items: z.array(z.number()),
  lane: LaneSchema,
  spells: z.array(z.string()),
  gold: z.number().nonnegative(),
  runes: z.array(z.object({})),
  cs: z.number().nonnegative(),
  vs: z.number().nonnegative(),
  damage: z.number().nonnegative(),
});

export type Team = z.infer<typeof TeamSchema>;
export const TeamSchema = z.array(ChampionSchema).length(5);

export type Match = z.infer<typeof MatchSchema>;
export const MatchSchema = z.strictObject({
  player: PlayerConfigEntrySchema,
  name: z.string().min(0),
  cs: z.number().nonnegative(),
  vs: z.number().nonnegative(),
  lp: z.number(),
  wins: z.number().nonnegative(),
  losses: z.number().nonnegative(),
  champion: z.string().min(0),
  damage: z.number().nonnegative(),
  outcome: z.enum(["Victory", "Defeat", "Surrender"]),
  duration: z.number().nonnegative(),
  teams: z.record(z.union([z.literal("red"), z.literal("blue")]), TeamSchema),
});

export function createMatchObject(
  username: string,
  player: Player,
  dto: MatchV5DTOs.MatchDto,
  lpChange: number,
): Match {
  const playerParticipant = _.chain(dto.info.participants)
    .filter((participant) => participant.puuid === player.config.league.leagueAccount.puuid)
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
    player: player.config,
    name: username,
    cs: playerParticipant.totalMinionsKilled + playerParticipant.neutralMinionsKilled,
    vs: playerParticipant.visionScore,
    lp: lpChange,
    wins: player.currentRank.wins - player.config.league.initialRank.wins,
    losses: player.currentRank.losses - player.config.league.initialRank.losses,
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
  const lane = parseLane(dto.teamPosition);

  if (lane === undefined) {
    throw Error(`invalid lane ${dto.teamPosition}`);
  }

  return {
    summonerName: dto.summonerName,
    champion: dto.championName,
    kills: dto.kills,
    deaths: dto.deaths,
    assists: dto.assists,
    items: [dto.item0, dto.item1, dto.item2, dto.item3, dto.item4, dto.item5, dto.item6],
    spells: [dto.summoner1Id, dto.summoner2Id],
    runes: [],
    lane,
    cs: dto.totalMinionsKilled + dto.neutralMinionsKilled,
    vs: dto.visionScore,
    damage: dto.totalDamageDealtToChampions,
    gold: dto.goldEarned,
    level: dto.champLevel,
  };
}
