import React from "react";
import { renderItems } from "./item.js";
import { Champion } from "../match.js";
import { palette } from "../assets/colors.js";
import _ from "lodash";

export function renderChampion(champion: Champion, highlight: boolean, durationInMinutes: number) {
  const items = renderItems(champion.items, champion.vs);
  const kdaRatio = _.round((champion.kills + champion.assists) / champion.deaths);

  return (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "row", justifyContent: "space-between" }}>
      <div style={{ display: "flex" }}>
        {champion.lane}
        {champion.level}
      </div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: highlight ? "700" : "400",
            color: highlight ? palette.gold[1] : "",
          }}
        >
          <span>{champion.summonerName}</span>
          <span>{champion.champion}</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <span
          style={{ display: "flex", fontWeight: highlight ? "700" : "400", color: highlight ? palette.gold[1] : "" }}
        >{`${champion.kills}/${champion.deaths}/${champion.assists}`}</span>
        <span>{kdaRatio} KDA</span>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>{items}</div>
      <div style={{ display: "flex", gap: "2rem" }}>{champion.damage}K damage</div>
      <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
        <span>{champion.gold} gold</span>
        <span>{_.round(champion.gold / durationInMinutes)} gpm</span>
      </div>
    </div>
  );
}
