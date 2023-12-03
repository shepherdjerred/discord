import "react";
import { renderItems } from "./item.js";
import { palette } from "../../assets/colors.js";
import _ from "lodash";
import { Champion } from "@glitter-boys/data";
import { summoner } from "../../../dataDragon/summoner.js";
import { latestVersion } from "../../../dataDragon/version.js";
import { CreepScore } from "./creepScore.js";
import { Gold } from "./gold.js";
import { Damage } from "./damage.js";
import { Kda } from "./kda.js";
import { Names } from "./names.js";
import { Lane } from "../lane/index.js";

export function renderChampion(champion: Champion, highlight: boolean, durationInMinutes: number, damageMax: number) {
  const items = renderItems(champion.items, champion.visionScore);

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
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          color: "",
        }}
      >
        <Lane lane={champion.lane} />
        <span style={{ fontWeight: 700, width: "10rem" }}>{champion.level}</span>
      </div>

      <Names championName={champion.championName} summonerName={champion.summonerName} highlight={highlight} />

      <div style={{ display: "flex", gap: "3rem" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>{summs}</div>
        <div style={{ display: "flex", flexDirection: "row" }}>{items}</div>
      </div>

      <Kda kills={champion.kills} deaths={champion.deaths} assists={champion.assists} highlight={highlight} />
      <Damage value={champion.damage} percent={damagePercent} highlight={highlight} />
      <Gold value={champion.gold} durationInMinutes={durationInMinutes} />
      <CreepScore value={champion.creepScore} durationInMinutes={durationInMinutes} />
    </div>
  );
}
