import { describe, expect, test } from "vitest";
import { latestVersion } from "./version.js";

describe("dataDragon", () => {
  test("should be able to get version", () => {
    expect(latestVersion).toMatchSnapshot();
  });
});
