import { readFile } from "fs/promises";
import { Font } from "satori";

export const font = {
  title: "Beaufort for LOL",
  body: "Spiegel",
};

// https://brand.riotgames.com/en-us/league-of-legends/typography
export async function loadFonts(): Promise<Font[]> {
  return [
    {
      name: "Beaufort for LOL",
      data: await readFile(new URL("fonts/BeaufortForLoL-TTF/BeaufortforLOL-Light.ttf", import.meta.url)),
      weight: 300,
      style: "normal",
    },
    {
      name: "Beaufort for LOL",
      data: await readFile(new URL("fonts/BeaufortForLoL-TTF/BeaufortforLOL-LightItalic.ttf", import.meta.url)),
      weight: 300,
      style: "italic",
    },
    {
      name: "Beaufort for LOL",
      data: await readFile(new URL("fonts/BeaufortForLoL-TTF/BeaufortforLOL-Regular.ttf", import.meta.url)),
      weight: 400,
      style: "normal",
    },
    {
      name: "Beaufort for LOL",
      data: await readFile(new URL("fonts/BeaufortForLoL-TTF/BeaufortforLOL-Italic.ttf", import.meta.url)),
      weight: 400,
      style: "italic",
    },
    {
      name: "Beaufort for LOL",
      data: await readFile(new URL("fonts/BeaufortForLoL-TTF/BeaufortforLOL-Medium.ttf", import.meta.url)),
      weight: 500,
      style: "normal",
    },
    {
      name: "Beaufort for LOL",
      data: await readFile(new URL("fonts/BeaufortForLoL-TTF/BeaufortforLOL-MediumItalic.ttf", import.meta.url)),
      weight: 500,
      style: "italic",
    },
    {
      name: "Beaufort for LOL",
      data: await readFile(new URL("fonts/BeaufortForLoL-TTF/BeaufortforLOL-Bold.ttf", import.meta.url)),
      weight: 700,
      style: "normal",
    },
    {
      name: "Beaufort for LOL",
      data: await readFile(new URL("fonts/BeaufortForLoL-TTF/BeaufortforLOL-BoldItalic.ttf", import.meta.url)),
      weight: 700,
      style: "italic",
    },
    {
      name: "Beaufort for LOL",
      data: await readFile(new URL("fonts/BeaufortForLoL-TTF/BeaufortforLOL-Heavy.ttf", import.meta.url)),
      weight: 800,
      style: "normal",
    },
    {
      name: "Beaufort for LOL",
      data: await readFile(new URL("fonts/BeaufortForLoL-TTF/BeaufortforLOL-HeavyItalic.ttf", import.meta.url)),
      weight: 800,
      style: "italic",
    },
    {
      name: "Spiegel",
      data: await readFile(new URL("fonts/Spiegel-TTF/Spiegel_TT_Regular.ttf", import.meta.url)),
      weight: 400,
      style: "normal",
    },
    {
      name: "Spiegel",
      data: await readFile(new URL("fonts/Spiegel-TTF/Spiegel_TT_Regular_Italic.ttf", import.meta.url)),
      weight: 400,
      style: "italic",
    },
    {
      name: "Spiegel",
      data: await readFile(new URL("fonts/Spiegel-TTF/Spiegel_TT_SemiBold.ttf", import.meta.url)),
      weight: 500,
      style: "normal",
    },
    {
      name: "Spiegel",
      data: await readFile(new URL("fonts/Spiegel-TTF/Spiegel_TT_SemiBold_Italic.ttf", import.meta.url)),
      weight: 500,
      style: "italic",
    },
    {
      name: "Spiegel",
      data: await readFile(new URL("fonts/Spiegel-TTF/Spiegel_TT_Bold.ttf", import.meta.url)),
      weight: 700,
      style: "normal",
    },
    {
      name: "Spiegel",
      data: await readFile(new URL("fonts/Spiegel-TTF/Spiegel_TT_Bold_Italic.ttf", import.meta.url)),
      weight: 700,
      style: "italic",
    },
  ];
}
