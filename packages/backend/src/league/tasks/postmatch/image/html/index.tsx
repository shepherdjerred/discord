import _ from "lodash";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import React from "react";
import { loadFonts } from "../assets/fonts.js";
import { palette } from "../assets/colors.js";
import { renderTeam } from "./team.js";
import { diffToString } from "../../../../model/leaguePoints.js";
import { Match } from "../../../../model/match.js";

export async function matchToImage(match: Match) {
  // const bg = await readFile("src/league/tasks/postmatch/image/image/bg.jpg");

  const minutes = _.round(match.durationInSeconds / 60);

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
        background: `linear-gradient(90deg, ${palette.blue.gradient.dark.start} 0%, ${palette.blue.gradient.dark.end} 50%, ${palette.blue.gradient.dark.start} 100%)`,
        display: "flex",
        flexDirection: "column",
        paddingLeft: "5rem",
        paddingRight: "5rem",
        fontSize: "5rem",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: "12rem",
          display: "flex",
          gap: "10rem",
          alignItems: "flex-end",
          justifyContent: "space-between",
          alignSelf: "flex-start",
          marginBottom: "5rem",
        }}
      >
        <span style={{ color: palette.gold[4] }}>{match.player.outcome}</span>
        <div style={{ fontSize: "6rem", display: "flex", marginBottom: "1rem" }}>
          {minutes}min {match.durationInSeconds % 60}s
        </div>
        <div style={{ display: "flex", gap: "2rem", fontSize: "4rem", color: palette.grey[1], marginBottom: "1.5rem" }}>
          <span>{diffToString(match.player.leaguePointsDelta)} LP</span>
          <span>W: {match.player.tournamentWins}</span>
          <span>L: {match.player.tournamentLosses}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "6rem", flexDirection: "column" }}>
        {renderTeam(match.teams.blue, "blue", match.player.champion.championName, match.durationInSeconds / 60)}
        {renderTeam(match.teams.red, "red", match.player.champion.championName, match.durationInSeconds / 60)}
      </div>
    </div>
  );

  const fonts = await loadFonts();
  const svg = await satori(jsx, {
    width: 4100,
    height: 3500,
    fonts,
  });
  const resvg = new Resvg(svg, { dpi: 600, shapeRendering: 2, textRendering: 2, imageRendering: 0 });
  const pngData = resvg.render();
  return pngData.asPng();
}
