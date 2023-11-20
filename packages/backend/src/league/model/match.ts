import _ from "lodash";
import { MatchV5DTOs } from "twisted/dist/models-dto/index.js";
import { z } from "zod";
import { ChampionSchema, createChampionObject } from "./champion.js";
import { Player } from "./player.js";
import { PlayerConfigEntrySchema } from "./playerConfigEntry.js";
import { RosterSchema } from "./roster.js";
import { Team, TeamSchema, parseTeam } from "./team.js";
import { LaneSchema, parseLane } from "./lane.js";

export type Match = z.infer<typeof MatchSchema>;
export const MatchSchema = z.strictObject({
  durationInSeconds: z.number().nonnegative(),
  // this field stores data specific to the player we care about
  player: z.strictObject({
    playerConfig: PlayerConfigEntrySchema,
    leaguePointsDelta: z.number(),
    tournamentWins: z.number().nonnegative(),
    tournamentLosses: z.number().nonnegative(),
    outcome: z.enum(["Victory", "Defeat", "Surrender"]),
    champion: ChampionSchema,
    team: TeamSchema,
    lane: LaneSchema.optional(),
    laneOpponent: ChampionSchema.optional(),
  }),
  teams: z.strictObject({
    red: RosterSchema,
    blue: RosterSchema,
  }),
});

export function createMatchObject(player: Player, dto: MatchV5DTOs.MatchDto, lpChange: number): Match {
  const playerParticipant = _.chain(dto.info.participants)
    .filter((participant) => participant.puuid === player.config.league.leagueAccount.puuid)
    .first()
    .value();

  if (playerParticipant == undefined) {
    throw new Error(`invalid state: ${JSON.stringify(dto.info.participants)}`);
  }

  let outcome: "Victory" | "Defeat" | "Surrender";
  if (playerParticipant.win) {
    outcome = "Victory";
  } else if (playerParticipant.gameEndedInSurrender) {
    outcome = "Surrender";
  } else {
    outcome = "Defeat";
  }

  const team = parseTeam(playerParticipant.teamId);
  if (team == undefined) {
    throw new Error(`invalid team: ${JSON.stringify(playerParticipant.teamId)}`);
  }

  const lane = parseLane(playerParticipant.lane);

  const teams = {
    blue: _.map(dto.info.participants.slice(0, 5), createChampionObject),
    red: _.map(dto.info.participants.slice(5, 10), createChampionObject),
  };

  let otherTeam: Team;
  if (team === "blue") {
    otherTeam = "red";
  } else {
    otherTeam = "blue";
  }

  const laneOpponent = _.chain(teams[otherTeam])
    .filter((p) => p.lane === lane)
    .first()
    .value();

  return {
    player: {
      playerConfig: player.config,
      leaguePointsDelta: lpChange,
      tournamentWins: player.currentRank.wins - player.config.league.initialRank.wins,
      tournamentLosses: player.currentRank.losses - player.config.league.initialRank.losses,
      champion: createChampionObject(playerParticipant),
      outcome,
      team,
      lane,
      laneOpponent,
    },
    durationInSeconds: dto.info.gameDuration,
    teams,
  };
}
