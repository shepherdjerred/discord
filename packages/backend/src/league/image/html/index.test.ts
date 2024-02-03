import { readFile } from "fs/promises";
import { describe, expect, test } from "vitest";
import { matchToImage } from "./index.js";
import { MatchV5DTOs } from "twisted/dist/models-dto/index.js";
import { toMatch } from "../../model/match.js";
import { toMatchImageSnapshot } from "jest-image-snapshot";

declare module "vitest" {
  interface Assertion<T> {
    toMatchImageSnapshot(): T;
  }
}

expect.extend({ toMatchImageSnapshot });

const testdataPath = new URL("testdata/match.json", import.meta.url);

describe("index", () => {
  test("test", async () => {
    const exampleMatch = JSON.parse((await readFile(testdataPath)).toString()) as MatchV5DTOs.MatchDto;

    const matchObj = toMatch(
      {
        config: {
          name: "name",
          league: {
            leagueAccount: {
              puuid: "XtEsV464OFaO3c0_q9REa6wYF0HpC2LK4laLnyM7WhfAVeuDz9biieJ5ZRD049AUCBjLjyBeeezTaw",
              accountId: "accountId",
              id: "id",
            },
          },
          discordAccount: {
            id: "discord id",
          },
        },
        ranks: {
          solo: { division: 3, tier: "gold", lp: 11, wins: 10, losses: 20 },
          flex: { division: 1, tier: "gold", lp: 4, wins: 50, losses: 30 },
        },
      },
      exampleMatch,
      { division: 4, tier: "gold", lp: 11, wins: 10, losses: 20 },
      { division: 1, tier: "gold", lp: 4, wins: 50, losses: 30 },
    );
    const result = await matchToImage(matchObj);
    expect(result).toMatchImageSnapshot();
  }, 20000);
});
