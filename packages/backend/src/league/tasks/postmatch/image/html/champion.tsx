import React from "react";
import { renderItems } from "./item.js";
import { Champion } from "../match.js";
import { palette } from "../assets/colors.js";

export function renderChampion(champion: Champion, highlight: boolean) {
  const items = renderItems(champion.items, champion.vs);

  return (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "row", justifyContent: "space-between" }}>
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
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>{items}</div>
    </div>
  );
}
