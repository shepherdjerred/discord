import { writeFile } from "fs/promises";
import { describe, test } from "vitest";
import { matchToImage } from "./index.js";
import { PlayerConfigEntry } from "@glitter-boys/data";
import { Player } from "@glitter-boys/data";
import exampleMatch from "./match.json" assert { type: "json" };
import { MatchV5DTOs } from "twisted/dist/models-dto/index.js";
import { createMatchObject } from "../../match.js";

describe("index", () => {
  test("test", async () => {
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
    const result = await matchToImage(matchObj);
    await writeFile("test.png", result);
  });
});
