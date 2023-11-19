import React from "react";
import { Team } from "../match.js";
import { renderChampion } from "./champion.js";
import _ from "lodash";

export function renderTeam(team: Team, name: string, highlight: string, durationInMinutes: number) {
  const teamKills = _.sumBy(team, (champion) => champion.kills);
  const teamDeaths = _.sumBy(team, (champion) => champion.deaths);
  const teamAssists = _.sumBy(team, (champion) => champion.assists);
  const ratio = _.round((teamKills + teamAssists) / teamDeaths, 2);
  const teamGold = _.sumBy(team, (champion) => champion.gold);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
      <span>Team {name}</span>
      <span>
        {teamKills}/{teamDeaths}/{teamAssists} KDA, ratio {ratio}
      </span>
      <span>{teamGold} gold</span>
      {_.map(team, (champion) => renderChampion(champion, champion.champion === highlight, durationInMinutes))}
    </div>
  );
}
