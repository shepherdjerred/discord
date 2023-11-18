import { describe, it } from "vitest";
import { askBrian } from "./chatgpt.js";

describe("chatgpt", () => {
  it("should work", async () => {
    const response = await askBrian("test");
    console.log(response);
  });
});
