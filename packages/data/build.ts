import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./dist");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./dist",
  test: false,
  shims: {
    deno: true,
  },
  package: {
    name: "@glitter-boys/data",
    version: Deno.args[0],
  },
});
