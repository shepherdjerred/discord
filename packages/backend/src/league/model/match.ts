import { Champion, Match, Rank, invertTeam } from "@glitter-boys/data";
import { Player } from "@glitter-boys/data";
import { parseTeam } from "@glitter-boys/data";
import _ from "lodash";
import { MatchV5DTOs } from "twisted/dist/models-dto/index.js";
import { participantToChampion } from "./champion.js";
import { match } from "ts-pattern";
import assert from "assert";

function findParticipant(puuid: string, participants: MatchV5DTOs.ParticipantDto[]): MatchV5DTOs.ParticipantDto {
  return _.chain(participants)
    .filter((participant) => participant.puuid === puuid)
    .first()
    .value();
}

export function getOutcome(participant: MatchV5DTOs.ParticipantDto) {
  return match(participant)
    .returnType<"Victory" | "Surrender" | "Defeat">()
    .with({ win: true }, () => "Victory")
    .with({ gameEndedInSurrender: true }, () => "Surrender")
    .with({ win: false }, () => "Defeat")
    .exhaustive();
}

function getLaneOpponent(player: Champion, opponents: Champion[]): Champion {
  return _.chain(opponents)
    .filter((opponent) => opponent.lane === player.lane)
    .first()
    .value();
}

function getTeams(participants: MatchV5DTOs.ParticipantDto[]) {
  return {
    blue: _.map(participants.slice(0, 5), participantToChampion),
    red: _.map(participants.slice(5, 10), participantToChampion),
  };
}

export function toMatch(player: Player, matchDto: MatchV5DTOs.MatchDto, oldRank: Rank, newRank: Rank): Match {
  const participant = findParticipant(player.config.league.leagueAccount.puuid, matchDto.info.participants);
  const champion = participantToChampion(participant);
  const team = parseTeam(participant.teamId);
  const teams = getTeams(matchDto.info.participants);

  assert(team !== undefined);

  const enemyTeam = invertTeam(team);

  return {
    player: {
      playerConfig: player.config,
      oldRank,
      newRank,
      tournamentWins: player.ranks.solo.wins - player.config.league.initialRank.wins,
      tournamentLosses: player.ranks.solo.losses - player.config.league.initialRank.losses,
      champion,
      outcome: getOutcome(participant),
      team: team,
      lane: champion.lane,
      laneOpponent: getLaneOpponent(champion, teams[enemyTeam]),
    },
    durationInSeconds: matchDto.info.gameDuration,
    teams,
  };
}
