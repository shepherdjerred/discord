import { summoner } from "./summoner.ts";

describe("dataDragon", () => {
  test("should be able to get champion data", () => {
    expect(summoner).toMatchSnapshot();
  });
});
