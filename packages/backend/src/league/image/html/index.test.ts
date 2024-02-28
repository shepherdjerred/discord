import { matchToSvg, svgToPng } from "./index.tsx";
import { PlayerConfigEntry } from "@glitter-boys/data";
import { Player } from "@glitter-boys/data";
import exampleMatch from "./match.json" assert { type: "json" };
import { MatchV5DTOs } from "npm:twisted@1.55.0/dist/models-dto/index.js";
import { createMatchObject } from "../../match.ts";
import { assertSnapshot } from "https://deno.land/std@0.208.0/testing/snapshot.ts";

<<<<<<< HEAD
Deno.test("image matches", async (t) => {
  const matchObj = createMatchObject(
    {
      config: {
        league: {
          leagueAccount: {
            puuid:
              "XtEsV464OFaO3c0_q9REa6wYF0HpC2LK4laLnyM7WhfAVeuDz9biieJ5ZRD049AUCBjLjyBeeezTaw",
||||||| 1e5c8ed
describe("index", () => {
  test("test", async () => {
    const matchObj = createMatchObject(
      {
        config: {
          league: {
            leagueAccount: { puuid: "XtEsV464OFaO3c0_q9REa6wYF0HpC2LK4laLnyM7WhfAVeuDz9biieJ5ZRD049AUCBjLjyBeeezTaw" },
            initialRank: { division: 4, tier: "gold", lp: 11, wins: 10, losses: 20 },
=======
describe("index", () => {
  test("test", async () => {
    const exampleMatch = JSON.parse((await readFile(testdataPath)).toString()) as MatchV5DTOs.MatchDto;

    const matchObj = toMatch(
      {
        config: {
          name: "name",
          league: {
    exampleMatch as unknown as MatchV5DTOs.MatchDto,
    27,
  );
  const result = await matchToSvg(matchObj);
  await assertSnapshot(t, result);
  Deno.writeFile("test.png", svgToPng(result));
||||||| 1e5c8ed
        } as unknown as PlayerConfigEntry,
        currentRank: { division: 1, tier: "gold", lp: 4, wins: 50, losses: 30 },
      } as Player,
      exampleMatch as MatchV5DTOs.MatchDto,
      27,
    );
    const result = await matchToImage(matchObj);
  });
=======
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
>>>>>>> main
});
