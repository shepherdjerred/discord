import React from "react";
import { renderChampion } from "./champion.js";
import _ from "lodash";
import { palette } from "../assets/colors.js";
import { font } from "../assets/index.js";
import { Roster } from "../../model/roster.js";
import { Team } from "../../model/team.js";

export function renderTeam(team: Roster, side: Team, highlight: string, durationInMinutes: number) {
  const teamKills = _.sumBy(team, (champion) => champion.kills);
  const teamDeaths = _.sumBy(team, (champion) => champion.deaths);
  const teamAssists = _.sumBy(team, (champion) => champion.assists);
  const teamGold = _.sumBy(team, (champion) => champion.gold);
  const mostDamage = _.chain(team)
    .map((champion) => champion.damage)
    .max()
    .value();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
      <div style={{ display: "flex", gap: "6rem" }}>
        <span
          style={{
            color: side === "blue" ? palette.teams.blue : palette.teams.red,
            fontFamily: font.title,
            fontWeight: 700,
          }}
        >
          TEAM {side === "blue" ? 1 : 2}
        </span>
        <span style={{ fontWeight: 700 }}>
          {teamKills} / {teamDeaths} / {teamAssists}
        </span>
        <span style={{ fontWeight: 700 }}>{teamGold.toLocaleString()} gold</span>
      </div>
      {_.map(team, (champion) =>
        renderChampion(champion, champion.championName === highlight, durationInMinutes, mostDamage),
      )}
    </div>
  );
}