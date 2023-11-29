import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./dist");

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./dist",
  shims: {
    deno: true,
  },
  package: {
    name: "@glitter-boys/data",
    version: Deno.args[0],
  },
});
