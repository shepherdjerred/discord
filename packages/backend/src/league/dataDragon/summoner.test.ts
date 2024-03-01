import { summoner } from "./summoner.ts";
import { assertSnapshot } from "https://deno.land/std@0.208.0/testing/snapshot.ts";

Deno.test("should be able to get champion data", (t) => {
  assertSnapshot(t, summoner);
});
