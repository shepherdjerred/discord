import React from "react";
import { renderItems } from "./item.js";
import { Champion } from "../match.js";
import { palette } from "../assets/colors.js";
import _ from "lodash";
import { laneToString } from "../../../../model/lane.js";

export function renderChampion(champion: Champion, highlight: boolean, durationInMinutes: number) {
  const items = renderItems(champion.items, champion.vs);
  const kdaRatio = _.round((champion.kills + champion.assists) / champion.deaths);
  const lane = laneToString(champion.lane);

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", alignContent: "space-between", alignItems: "center" }}>
        <span>{lane}</span>
        <span style={{ fontWeight: 700 }}>{champion.level}</span>
      </div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            color: highlight ? palette.gold.bright : "",
          }}
        >
          <span style={{ fontWeight: 700 }}>{champion.summonerName}</span>
          <span>{champion.champion}</span>
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>{items}</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span
          style={{ display: "flex", fontWeight: highlight ? 700 : 400, color: highlight ? palette.gold[1] : "" }}
        >{`${champion.kills} / ${champion.deaths} / ${champion.assists}`}</span>
        <span>{kdaRatio} KDA</span>
      </div>
      <div style={{ display: "flex", gap: "2rem" }}>{champion.damage.toLocaleString()}K damage</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span>{champion.gold.toLocaleString()} gold</span>
        <span>{_.round(champion.gold / durationInMinutes).toLocaleString()} / min</span>
      </div>
    </div>
  );
}
