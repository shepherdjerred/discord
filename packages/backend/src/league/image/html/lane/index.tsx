import { Lane } from "@glitter-boys/data";
import { readFile } from "fs/promises";

const images: Record<Lane | "unknown", string> = {
  top: await readFile(new URL("assets/top.png", import.meta.url), "base64"),
  jungle: await readFile(new URL("assets/jungle.png", import.meta.url), "base64"),
  middle: await readFile(new URL("assets/middle.png", import.meta.url), "base64"),
  adc: await readFile(new URL("assets/bottom.png", import.meta.url), "base64"),
  support: await readFile(new URL("assets/support.png", import.meta.url), "base64"),
  unknown: await readFile(new URL("assets/unknown.png", import.meta.url), "base64"),
};

export function Lane({ lane }: { lane: Lane | undefined }) {
  return (
    <span style={{ width: "20rem", display: "flex", justifyContent: "center" }}>
      <img src={`data:image/png;base64,${images[lane || "unknown"]}`} style={{ width: "8rem" }} />
    </span>
  );
}
