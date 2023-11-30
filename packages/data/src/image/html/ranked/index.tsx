import React from "react";
import { readFile } from "fs/promises";
import _ from "lodash";
import { palette } from "../../assets/colors.js";
import { Tier, Rank, wasPromoted } from "../../../index.js";

const assets = "src/league/image/html/ranked/assets";

const images: Record<Tier, string> = {
  iron: await readFile(`${assets}/Rank=Iron.png`, "base64"),
  bronze: await readFile(`${assets}/Rank=Bronze.png`, "base64"),
  silver: await readFile(`${assets}/Rank=Silver.png`, "base64"),
  gold: await readFile(`${assets}/Rank=Gold.png`, "base64"),
  platinum: await readFile(`${assets}/Rank=Platinum.png`, "base64"),
  emerald: await readFile(`${assets}/Rank=Emerald.png`, "base64"),
  diamond: await readFile(`${assets}/Rank=Diamond.png`, "base64"),
  master: await readFile(`${assets}/Rank=Master.png`, "base64"),
  grandmaster: await readFile(`${assets}/Rank=Grandmaster.png`, "base64"),
  challenger: await readFile(`${assets}/Rank=Challenger.png`, "base64"),
};

export function RankedBadge({ oldRank, newRank }: { oldRank: Rank; newRank: Rank }) {
  const badge = images[newRank.tier];
  const showPromoted = wasPromoted(oldRank, newRank);
  const showDemoted = wasPromoted(newRank, oldRank);
  return (
    <span style={{ color: palette.gold[1], fontSize: "6rem" }}>
      {showPromoted && `Promoted!`}
      {showDemoted && `Demoted!`}
      <img src={`data:image/png;base64,${badge}`} style={{ width: "12rem", height: "12rem" }} />
      {newRank.division}
    </span>
  );
}
