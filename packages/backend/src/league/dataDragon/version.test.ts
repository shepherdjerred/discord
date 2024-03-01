import { latestVersion } from "./version.ts";

describe("dataDragon", () => {
  test("should be able to get version", () => {
    expect(latestVersion).toMatchSnapshot();
  });
});
