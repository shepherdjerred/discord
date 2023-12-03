import { palette } from "../../assets/colors.js";

export function Names({
  summonerName,
  championName,
  highlight,
}: {
  summonerName: string;
  championName: string;
  highlight: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        color: highlight ? palette.gold.bright : "",
        width: "50rem",
      }}
    >
      <span style={{ fontWeight: 700 }}>{summonerName}</span>
      <span>{championName}</span>
    </div>
  );
}
