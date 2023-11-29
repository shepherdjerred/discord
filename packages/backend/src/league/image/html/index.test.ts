import { readFile } from "fs/promises";
import { describe, expect, test } from "vitest";
import { matchToSvg, svgToPng } from "./index.js";
import { PlayerConfigEntry } from "@glitter-boys/data";
import { Player } from "@glitter-boys/data";
import { MatchV5DTOs } from "twisted/dist/models-dto/index.js";
import { createMatchObject } from "../../match.js";
import { toMatchImageSnapshot } from "jest-image-snapshot";

declare module "vitest" {
  interface Assertion<T> {
    toMatchImageSnapshot(): T;
  }
}

expect.extend({ toMatchImageSnapshot });

const testdataPath = "src/league/image/html/testdata/match.json";

describe("index", () => {
  test("test", async () => {
    const exampleMatch = JSON.parse((await readFile(testdataPath)).toString());

    const matchObj = createMatchObject(
      {
        config: {
          league: {
            leagueAccount: { puuid: "XtEsV464OFaO3c0_q9REa6wYF0HpC2LK4laLnyM7WhfAVeuDz9biieJ5ZRD049AUCBjLjyBeeezTaw" },
            initialRank: { division: 4, tier: "gold", lp: 11, wins: 10, losses: 20 },
          },
        } as unknown as PlayerConfigEntry,
        currentRank: { division: 1, tier: "gold", lp: 4, wins: 50, losses: 30 },
      } as Player,
      exampleMatch as MatchV5DTOs.MatchDto,
      { division: 4, tier: "gold", lp: 11, wins: 10, losses: 20 },
      { division: 1, tier: "gold", lp: 4, wins: 50, losses: 30 },
    );
    const result = await matchToSvg(matchObj);
    const img = svgToPng(result);
    expect(result).toMatchFileSnapshot("__snapshots__/test.svg");
    expect(img).toMatchImageSnapshot();
  }, 20000);
});
