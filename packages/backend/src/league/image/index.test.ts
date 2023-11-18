import { writeFile } from "fs/promises";
import { describe, test } from "vitest";
import { exampleMatch } from "./example.js";
import { matchToImage } from "./index.js";
import { createMatchObject } from "./match.js";
import { PlayerConfigEntry } from "../player/config.js";

describe("index", () => {
  test("test", async () => {
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
    await writeFile("test.png", result);
  });
});
