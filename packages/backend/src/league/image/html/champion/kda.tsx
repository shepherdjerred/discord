import _ from "lodash";
import { palette } from "../../assets/colors.js";

export function Kda({
  kills,
  deaths,
  assists,
  highlight,
}: {
  kills: number;
  deaths: number;
  assists: number;
  highlight: boolean;
}) {
  const kdaRatio = deaths === 0 ? kills + deaths : _.round((kills + assists) / deaths, 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "30rem" }}>
      <span
        style={{ fontWeight: 700, color: highlight ? palette.gold[1] : "" }}
      >{`${kills} / ${deaths} / ${assists}`}</span>
      <span>{kdaRatio} KDA</span>
    </div>
  );
}