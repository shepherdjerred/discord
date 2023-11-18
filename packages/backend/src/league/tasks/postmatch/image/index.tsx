import _ from "lodash";
import { Champion, Match } from "./match.js";
import satori from "satori";
import { readFile } from "fs/promises";
import { Resvg } from "@resvg/resvg-js";
import React from "react";

export async function matchToImage(match: Match) {
  const font = await readFile("src/league/tasks/postmatch/image/fonts/BeaufortForLoL-TTF/BeaufortforLOL-Medium.ttf");
  const fontBold = await readFile("src/league/tasks/postmatch/image/fonts/BeaufortForLoL-TTF/BeaufortforLOL-Bold.ttf");
  const bg = await readFile("src/league/tasks/postmatch/image/image/bg.jpg");

  const minutes = _.round(match.duration / 60);
  const damageString = `${_.round(match.damage / 1000)}K damage`;
  const vsString = `${match.vs} vision score (${_.round(match.vs / minutes, 2)}/min)`;
  const csString = `${match.cs} cs (${_.round(match.cs / minutes, 1)}/min)`;

  function transformChampion(champion: Champion, color: string) {
    const isPlayer = champion.champion === match.champion;

    const items = _.map(champion.items, (item) => {
      return <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>{String(item)}</div>;
    });

    return (
      <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "5rem", color }}>
          <div style={{ display: "flex", gap: "2rem" }}>
            <span style={{ display: "flex", fontWeight: isPlayer ? "700" : "400", color: isPlayer ? "#F0E6D2" : "" }}>
              {champion.champion}
            </span>
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <span
              style={{ display: "flex", fontWeight: isPlayer ? "700" : "400", color: isPlayer ? "#F0E6D2" : "" }}
            >{`${champion.kills}/${champion.deaths}/${champion.assists}`}</span>
          </div>
        </div>
        <div style={{ display: "none", flexDirection: "row", gap: "2rem" }}>{items}</div>
      </div>
    );
  }

  const red = _.map(match.teams.red, (champion) => transformChampion(champion, "#E84057"));

  const blue = _.map(match.teams.blue, (champion) => transformChampion(champion, "#00B8ED"));

  // this variable will store the content of the "svg" variable below, but as JSX
  const jsx = (
    <div
      style={{
        width: "100%",
        height: "100%",
        color: "#A09B8C",
        backgroundColor: "#091428",
        display: "flex",
        flexDirection: "column",
        padding: "0rem",
        gap: "3rem",
        fontSize: "5rem",
      }}
    >
      <img
        src={`data:image/jpeg;base64,${bg.toString("base64")}`}
        style={{ position: "absolute", filter: "blur(400px) grayscale(80%)" }}
      />
      <div style={{ color: "#C89B3C", fontSize: "12rem", display: "flex", gap: "3rem", alignItems: "flex-end" }}>
        {match.outcome}
        <div style={{ color: "#C89B3C", fontSize: "6rem", display: "flex", marginBottom: "1rem" }}>
          {minutes}min {match.duration % 60}s
        </div>
      </div>
      <div style={{ display: "flex", gap: "6rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>{red}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>{blue}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          <div style={{ display: "flex" }}>{damageString}</div>
          <div style={{ display: "flex" }}>{vsString}</div>
          <div style={{ display: "flex" }}>{csString}</div>
        </div>
      </div>
    </div>
  );

  const svg = await satori(jsx, {
    width: 4000,
    height: 2000,
    fonts: [
      {
        name: "Beautfort",
        data: font,
        weight: 400,
        style: "normal",
      },
      {
        name: "Beautfort",
        data: fontBold,
        weight: 700,
        style: "normal",
      },
    ],
  });
  const resvg = new Resvg(svg, { dpi: 600, shapeRendering: 2, textRendering: 2, imageRendering: 0 });
  const pngData = resvg.render();
  return pngData.asPng();
}
