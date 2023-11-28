import { Match } from "@glitter-boys/data";
import { Player } from "@glitter-boys/data";
import { Team, parseTeam } from "@glitter-boys/data";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash@4.17.21";
import { MatchV5DTOs } from "npm:twisted@1.55.0/dist/models-dto/index.js";
import { createChampionObject } from "./champion.ts";

export function createMatchObject(
  player: Player,
  dto: MatchV5DTOs.MatchDto,
  lpChange: number
): Match {
  const playerParticipant = _.chain(dto.info.participants)
    .filter(
      (participant) =>
        participant.puuid === player.config.league.leagueAccount.puuid
    )
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
    throw new Error(
      `invalid team: ${JSON.stringify(playerParticipant.teamId)}`
    );
  }

  const lane = createChampionObject(playerParticipant).lane;

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
      tournamentWins:
        player.currentRank.wins - player.config.league.initialRank.wins,
      tournamentLosses:
        player.currentRank.losses - player.config.league.initialRank.losses,
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
