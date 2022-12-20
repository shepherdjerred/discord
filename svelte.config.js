import adapter from "@sveltejs/adapter-netlify";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      edge: false,
      split: false,
    }),
  },
};

export default config;
