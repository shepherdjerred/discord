import _ from "lodash";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import "react";
import { loadFonts } from "../assets/index.js";
import { Match } from "@glitter-boys/data";
import { Report } from "./report.jsx";

export async function matchToImage(match: Match) {
  const svg = await matchToSvg(match);
  const png = svgToPng(svg);
  return png;
}

async function matchToSvg(match: Match) {
  const fonts = await loadFonts();
  const svg = await satori(<Report match={match} />, {
    width: 4500,
    height: 3500,
    fonts,
  });
  return svg;
}

function svgToPng(svg: string) {
  const resvg = new Resvg(svg, { dpi: 600, shapeRendering: 2, textRendering: 2, imageRendering: 0 });
  const pngData = resvg.render();
  return pngData.asPng();
}
