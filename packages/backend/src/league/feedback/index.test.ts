import { generateFeedbackMessage as generateFeedbackMessage } from "./index.ts";
import { MatchV5DTOs } from "npm:twisted@1.55.0/dist/models-dto/index.js";
import exampleMatch from "../image/html/match.json" assert { type: "json" };
import { Player } from "@glitter-boys/data";
import { PlayerConfigEntry } from "@glitter-boys/data";
import { createMatchObject } from "../match.ts";

describe(
  "feedback",
  () => {
    it("should return a string", async () => {
      const matchObj = createMatchObject(
        {
          config: {
            name: "Aaron",
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
          currentRank: {
            division: 1,
            tier: "gold",
            lp: 4,
            wins: 50,
            losses: 30,
          },
        } as Player,
        exampleMatch as MatchV5DTOs.MatchDto,
        27
      );
      const response = await generateFeedbackMessage(matchObj);
      console.log(response);
    });
  },
  { timeout: 20000 }
);
