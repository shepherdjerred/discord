import React from "react";
import { renderItems } from "./item.js";
import { Champion } from "../match.js";
import { palette } from "../assets/colors.js";
import _ from "lodash";
import { laneToString } from "../../../../model/lane.js";
import summoner from "../assets/summoner.json";

export function renderChampion(champion: Champion, highlight: boolean, durationInMinutes: number, damageMax: number) {
  const items = renderItems(champion.items, champion.vs);
  const kdaRatio = _.round((champion.kills + champion.assists) / champion.deaths, 1);
  const lane = laneToString(champion.lane);
  const damagePercent = _.round((champion.damage / damageMax) * 100);

  const summs = _.map(champion.spells, (spell) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const name = _.chain(summoner.data)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .pickBy((summoner) => summoner.key === spell.toString())
      .keys()
      .first()
      .value();

    if (name === undefined) {
      throw new Error(`Summoner spell ${spell} not found`);
    }

    return <img src={`https://ddragon.leagueoflegends.com/cdn/13.22.1/img/spell/${name}.png`} width="60" height="60" />;
  });

  return (
    <div
      style={{
        display: "flex",
        gap: ".1rem",
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

      <div style={{ display: "flex", gap: "3rem" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>{summs}</div>
        <div style={{ display: "flex", flexDirection: "row", gap: "0rem" }}>{items}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span
          style={{ display: "flex", fontWeight: 700, color: highlight ? palette.gold[1] : "" }}
        >{`${champion.kills} / ${champion.deaths} / ${champion.assists}`}</span>
        <span>{kdaRatio} KDA</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <div style={{ display: "flex", gap: "2rem", fontWeight: 700 }}>{champion.damage.toLocaleString()} dmg</div>
        <span style={{ width: "20rem", height: "2rem", backgroundColor: palette.grey[1] }}>
          <span
            style={{
              width: `${damagePercent}%`,
              height: "100%",
              backgroundColor: highlight ? palette.gold.bright : palette.white[1],
            }}
          />
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontWeight: 700 }}>{champion.gold.toLocaleString()} gold</span>
        <span>{_.round(champion.gold / durationInMinutes).toLocaleString()} / min</span>
      </div>
    </div>
  );
}
