import "react";
import { renderItems } from "./item.js";
import { palette } from "../assets/colors.js";
import _ from "lodash";
import { laneToString } from "@glitter-boys/data";
import { Champion } from "@glitter-boys/data";
import { summoner } from "../../dataDragon/summoner.js";
import { latestVersion } from "../../dataDragon/version.js";

export function renderChampion(champion: Champion, highlight: boolean, durationInMinutes: number, damageMax: number) {
  const items = renderItems(champion.items, champion.visionScore);
  const kdaRatio =
    champion.deaths === 0
      ? champion.kills + champion.deaths
      : _.round((champion.kills + champion.assists) / champion.deaths, 1);
  const lane = champion.lane ? laneToString(champion.lane) : "?";
  const damagePercent = _.round((champion.damage / damageMax) * 100);

  const summs = _.map(champion.spells, (spell) => {
    const name = _.chain(summoner.data)
      .pickBy((summoner) => summoner.key === spell.toString())
      .keys()
      .first()
      .value();

    if (name === undefined) {
      throw new Error(`Summoner spell ${spell} not found`);
    }

    return (
      <img
        src={`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${name}.png`}
        width="59"
        height="59"
        style={{ backgroundColor: palette.blue[5], border: `1px solid ${palette.gold.bright}` }}
      />
    );
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            display: "flex",
            background: `linear-gradient(
              to right,
              rgba(10, 20, 40, .7),
              rgba(10, 20, 40, .7),
              rgba(9, 20, 40, .8),
              rgba(9, 20, 40, 1)
            ),url("https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.championName}_0.jpg")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              color: "",
            }}
          >
            <span style={{ width: "20rem", display: "flex", justifyContent: "center" }}>{lane}</span>
            <span style={{ fontWeight: 700, width: "10rem" }}>{champion.level}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: highlight ? palette.gold.bright : "",
              width: "50rem",
            }}
          >
            <span style={{ fontWeight: 700 }}>{champion.summonerName}</span>
            <span>{champion.championName}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "3rem" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>{summs}</div>
        <div style={{ display: "flex", flexDirection: "row" }}>{items}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "30rem" }}>
        <span
          style={{ fontWeight: 700, color: highlight ? palette.gold[1] : "" }}
        >{`${champion.kills} / ${champion.deaths} / ${champion.assists}`}</span>
        <span>{kdaRatio} KDA</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", width: "40rem" }}>
        <div style={{ display: "flex", gap: "2rem", fontWeight: 700 }}>{champion.damage.toLocaleString()} dmg</div>
        <span style={{ width: "20rem", height: "1.5rem", backgroundColor: palette.grey[1] }}>
          <span
            style={{
              display: "flex",
              width: `${damagePercent}%`,
              height: "100%",
              backgroundColor: highlight ? palette.gold.bright : palette.white[1],
            }}
          />
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "30rem" }}>
        <span style={{ fontWeight: 700 }}>{champion.gold.toLocaleString()} gold</span>
        <span>{_.round(champion.gold / durationInMinutes).toLocaleString()} / min</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "30rem" }}>
        <span style={{ fontWeight: 700 }}>{champion.creepScore.toLocaleString()} CS</span>
        <span>{_.round(champion.creepScore / durationInMinutes, 2).toLocaleString()} / min</span>
      </div>
    </div>
  );
}
