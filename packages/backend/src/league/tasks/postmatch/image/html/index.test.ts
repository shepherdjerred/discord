import { writeFile } from "fs/promises";
import { describe, test } from "vitest";
import { exampleMatch } from "./example.js";
import { matchToImage } from "./index.js";
import { createMatchObject } from "../match.js";
import { PlayerConfigEntry } from "../../../../model/playerConfigEntry.js";
import { Player } from "../../../../model/player.js";

describe("index", () => {
  test("test", async () => {
    const matchObj = createMatchObject(
      "Jerred",
      {
        config: {
          league: {
            leagueAccount: { puuid: "XtEsV464OFaO3c0_q9REa6wYF0HpC2LK4laLnyM7WhfAVeuDz9biieJ5ZRD049AUCBjLjyBeeezTaw" },
            initialRank: { division: 4, tier: "gold", lp: 11, wins: 10, losses: 20 },
          },
        } as unknown as PlayerConfigEntry,
        currentRank: { division: 1, tier: "gold", lp: 4, wins: 50, losses: 30 },
      } as Player,
      exampleMatch,
      27,
    );
    const result = await matchToImage(matchObj);
    await writeFile("test.png", result);
  });
});
