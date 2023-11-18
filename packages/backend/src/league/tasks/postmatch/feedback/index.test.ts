import { describe, it } from "vitest";
import { generateMessageFromBrian } from "./index.js";

describe("brian", () => {
  it("should return a string", async () => {
    const response = await generateMessageFromBrian(`@spicy gamecube lost a 26 minute game playing TwistedFate middle
KDA: 3/7/7
DAMAGE CHARTS: 2nd place (15K damage)
11 vision score (0.42/min)
128 CS (4.9/min)
-22 LP (-0.014102564102564103/sec)`);
    console.log(response);
  });
});
