import React from "react";
import { Team } from "../match.js";
import { renderChampion } from "./champion.js";
import _ from "lodash";

export function renderTeam(team: Team, name: string, highlight: string) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
      <span>Team {name}</span>
      {_.map(team, (champion) => renderChampion(champion, champion.champion === highlight))}
    </div>
  );
}
