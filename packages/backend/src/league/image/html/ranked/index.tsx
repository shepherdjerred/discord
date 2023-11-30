import "react";
import { Rank, Tier, divisionToString, wasPromoted } from "@glitter-boys/data";
import { readFile } from "fs/promises";
import _ from "lodash";
import { palette } from "../../assets/colors.js";

const images: Record<Tier, string> = {
  iron: await readFile(new URL("assets/Rank=Iron.png", import.meta.url), "base64"),
  bronze: await readFile(new URL("assets/Rank=Bronze.png", import.meta.url), "base64"),
  silver: await readFile(new URL("assets/Rank=Silver.png", import.meta.url), "base64"),
  gold: await readFile(new URL("assets/Rank=Gold.png", import.meta.url), "base64"),
  platinum: await readFile(new URL("assets/Rank=Platinum.png", import.meta.url), "base64"),
  emerald: await readFile(new URL("assets/Rank=Emerald.png", import.meta.url), "base64"),
  diamond: await readFile(new URL("assets/Rank=Diamond.png", import.meta.url), "base64"),
  master: await readFile(new URL("assets/Rank=Master.png", import.meta.url), "base64"),
  grandmaster: await readFile(new URL("assets/Rank=Grandmaster.png", import.meta.url), "base64"),
  challenger: await readFile(new URL("assets/Rank=Challenger.png", import.meta.url), "base64"),
};

export function RankedBadge({ oldRank, newRank }: { oldRank: Rank; newRank: Rank }) {
  const badge = images[newRank.tier];
  const showPromoted = wasPromoted(oldRank, newRank);
  const showDemoted = wasPromoted(newRank, oldRank);
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
      }}
    >
      <div
        style={{
          color: palette.gold[1],
          fontSize: "6rem",
          display: "flex",
          alignItems: "flex-end",
          gap: "4rem",
          position: "absolute",
          right: "2rem",
          top: "-20rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column-reverse", alignItems: "stretch", gap: "2rem" }}>
          <span style={{ position: "relative", display: "flex", alignItems: "flex-end" }}>
            <img src={`data:image/png;base64,${badge}`} style={{ width: "24rem" }} />
            <span style={{ position: "relative", left: "-8rem", top: "-2rem" }}>
              {divisionToString(newRank.division)}
            </span>
          </span>
          <span style={{ position: "absolute", top: "22rem" }}>
            {showPromoted && `Promoted`}
            {showDemoted && `Demoted`}
          </span>
        </div>
      </div>
    </div>
  );
}
