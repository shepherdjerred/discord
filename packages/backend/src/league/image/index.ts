import _ from "lodash";
import { Champion, Match } from "./match.js";
import satori from "satori";
import { readFile } from "fs/promises";

export async function matchToImage(match: Match) {
  const font = await readFile("src/league/image/fonts/BeaufortForLoL-TTF/BeaufortforLOL-Medium.ttf");
  const fontBold = await readFile("src/league/image/fonts/BeaufortForLoL-TTF/BeaufortforLOL-Bold.ttf");

  const minutes = _.round(match.duration / 60);
  const damageString = `${_.round(match.damage / 1000)}K damage `;
  const vsString = `${match.vs} vision score (${_.round(match.vs / minutes, 2)}/min)`;
  const csString = `${match.cs} CS (${_.round(match.cs / minutes, 1)}/min)`;

  function transformChampion(champion: Champion) {
    const isPlayer = champion.champion === match.champion;
    return {
      type: "div",
      props: {
        children: [
          {
            type: "div",
            props: {
              children: [
                {
                  type: "span",
                  props: {
                    children: [champion.champion],
                    style: { display: "flex", fontWeight: isPlayer ? "700" : "400", color: isPlayer ? "#0397AB" : "" },
                  },
                },
                {
                  type: "span",
                  props: {
                    children: [`${champion.kills}/${champion.deaths}/${champion.assists}`],
                    style: { display: "flex", fontWeight: isPlayer ? "700" : "400", color: isPlayer ? "#0397AB" : "" },
                  },
                },
              ],
              style: { display: "flex", gap: "10px" },
            },
          },
        ],
        style: { display: "flex" },
      },
    };
  }

  const red = _.map(match.teams.red, transformChampion);

  const blue = _.map(match.teams.blue, transformChampion);

  const svg = await satori(
    {
      type: "div",
      props: {
        children: [
          {
            type: "div",
            props: {
              children: `Victory: ${match.name}`,
              style: { color: "#C89B3C", fontSize: "2rem", display: "flex", flexDirection: "column" },
            },
          },
          {
            type: "div",
            props: {
              children: [
                {
                  type: "div",
                  props: {
                    children: red,
                    style: { display: "flex", flexDirection: "column", gap: "10px" },
                  },
                },
                {
                  type: "div",
                  props: {
                    children: blue,
                    style: { display: "flex", flexDirection: "column", gap: "10px" },
                  },
                },
                {
                  type: "div",
                  props: {
                    children: [
                      {
                        type: "div",
                        props: {
                          children: [damageString],
                          style: { display: "flex" },
                        },
                      },
                      {
                        type: "div",
                        props: {
                          children: [vsString],
                          style: { display: "flex" },
                        },
                      },
                      {
                        type: "div",
                        props: {
                          children: [csString],
                          style: { display: "flex" },
                        },
                      },
                    ],
                    style: { display: "flex", flexDirection: "column", gap: "10px" },
                  },
                },
              ],
              style: { display: "flex", gap: "20px" },
            },
          },
        ],
        style: {
          width: "100%",
          height: "100%",
          color: "#A09B8C",
          backgroundColor: "#091428",
          display: "flex",
          flexDirection: "column",
          border: "5px",
          borderColor: "#0A323C",
          padding: "10px",
          gap: "10px",
        },
      },
    },
    {
      width: 600,
      height: 300,
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
    },
  );
  return svg;
}
