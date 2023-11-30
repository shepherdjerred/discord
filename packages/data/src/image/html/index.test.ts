import { describe, expect, test } from "vitest";
import { matchToImage } from "./index.js";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { Match } from "../../index.js";

declare module "vitest" {
  interface Assertion<T> {
    toMatchImageSnapshot(): T;
  }
}

expect.extend({ toMatchImageSnapshot });

describe("index", () => {
  test("test", async () => {
    const matchObj = {} as Match;
    const result = await matchToImage(matchObj);
    expect(result).toMatchImageSnapshot();
  }, 20000);
});
