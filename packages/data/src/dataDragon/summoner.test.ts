import { describe, expect, test } from "vitest";
import { summoner } from "./summoner.js";

describe("dataDragon", () => {
  test("should be able to get champion data", () => {
    expect(summoner).toMatchSnapshot();
  });
});
