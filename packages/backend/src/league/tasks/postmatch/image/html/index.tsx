import _ from "lodash";
import { Match } from "../match.js";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import React from "react";
import { loadFonts } from "../assets/fonts.js";
import { palette } from "../assets/colors.js";
import { renderTeam } from "./team.js";

export async function matchToImage(match: Match) {
  // const bg = await readFile("src/league/tasks/postmatch/image/image/bg.jpg");

  const minutes = _.round(match.duration / 60);

  if (!match.teams.red || !match.teams.blue) {
    throw new Error("Match must have both teams");
  }

  // this variable will store the content of the "svg" variable below, but as JSX
  const jsx = (
    <div
      style={{
        width: "100%",
        height: "100%",
        color: palette.grey[1],
        backgroundColor: palette.blue[6],
        display: "flex",
        flexDirection: "column",
        padding: "0rem",
        gap: "3rem",
        fontSize: "5rem",
      }}
    >
      {/* <img
        src={`data:image/jpeg;base64,${bg.toString("base64")}`}
        style={{ position: "absolute", filter: "blur(400px) grayscale(80%)" }}
      /> */}
      <div style={{ color: palette.gold[4], fontSize: "12rem", display: "flex", gap: "3rem", alignItems: "flex-end" }}>
        {match.outcome}
        <div style={{ color: palette.gold[4], fontSize: "6rem", display: "flex", marginBottom: "1rem" }}>
          {minutes}min {match.duration % 60}s
        </div>
        <span>{match.lp}LP</span>
        <span>W:{match.wins}</span>
        <span>L:{match.losses}</span>
      </div>
      <div style={{ display: "flex", gap: "6rem", flexDirection: "column" }}>
        {renderTeam(match.teams.blue, "blue", match.champion, match.duration / 60)}
        {renderTeam(match.teams.red, "red", match.champion, match.duration / 60)}
      </div>
    </div>
  );

  const fonts = await loadFonts();
  const svg = await satori(jsx, {
    width: 4096,
    height: 3500,
    fonts,
  });
  const resvg = new Resvg(svg, { dpi: 600, shapeRendering: 2, textRendering: 2, imageRendering: 0 });
  const pngData = resvg.render();
  return pngData.asPng();
}
