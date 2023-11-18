import { writeFile } from "fs/promises";
import { describe, test } from "vitest";
import { exampleMatch } from "./example.js";
import { matchToImage } from "./index.js";
import { createMatchObject } from "./match.js";
import { PlayerConfigEntry } from "../player/config.js";
import { Resvg } from "@resvg/resvg-js";

describe("index", () => {
  test("test", async () => {
    // TODO
    const matchObj = createMatchObject(
      "Jerred",
      {
        league: {
          leagueAccount: { puuid: "XtEsV464OFaO3c0_q9REa6wYF0HpC2LK4laLnyM7WhfAVeuDz9biieJ5ZRD049AUCBjLjyBeeezTaw" },
        },
      } as unknown as PlayerConfigEntry,
      exampleMatch,
    );
    const result = await matchToImage(matchObj);
    const resvg = new Resvg(result, {
      dpi: 600,
      shapeRendering: 2,
      textRendering: 2,
      imageRendering: 0,
    });
    const pngData = resvg.render();
    await writeFile("test.png", pngData.asPng());
  });
});
