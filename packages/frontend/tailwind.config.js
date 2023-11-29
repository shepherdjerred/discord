/** @type {import('tailwindcss').Config} */

import {
  blue,
  black,
  purple,
  white,
  yellow,
  pink,
  orange,
  slate,
} from "tailwindcss/colors";

import typography from "@tailwindcss/typography";

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      blue,
      black,
      purple,
      white,
      yellow,
      pink,
      orange,
      slate,
    },
  },
  plugins: [typography],
};
