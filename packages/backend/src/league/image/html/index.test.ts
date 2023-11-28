import { matchToImage } from "./index.ts";
import { PlayerConfigEntry } from "@glitter-boys/data";
import { Player } from "@glitter-boys/data";
import exampleMatch from "./match.json" assert { type: "json" };
import { MatchV5DTOs } from "npm:twisted@1.55.0/dist/models-dto/index.js";
import { createMatchObject } from "../../match.ts";

describe("index", () => {
  test("test", async () => {
    const matchObj = createMatchObject(
      {
        config: {
          league: {
            leagueAccount: {
              puuid:
                "XtEsV464OFaO3c0_q9REa6wYF0HpC2LK4laLnyM7WhfAVeuDz9biieJ5ZRD049AUCBjLjyBeeezTaw",
            },
            initialRank: {
              division: 4,
              tier: "gold",
              lp: 11,
              wins: 10,
              losses: 20,
            },
          },
        } as unknown as PlayerConfigEntry,
        currentRank: { division: 1, tier: "gold", lp: 4, wins: 50, losses: 30 },
      } as Player,
      exampleMatch as MatchV5DTOs.MatchDto,
      27
    );
    const result = await matchToImage(matchObj);
    Deno.writeFile("test.png", result);
  });
});
