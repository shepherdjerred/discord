import { readFile } from "fs/promises";
import { Font } from "satori";

const fontPath = "src/league/image/assets/fonts";

export const font = {
  title: "Beautfort",
  body: "Spiegel",
};

// https://brand.riotgames.com/en-us/league-of-legends/typography
export async function loadFonts(): Promise<Font[]> {
  return [
    {
      name: "Beautfort",
      data: await readFile(`${fontPath}/BeaufortForLoL-TTF/BeaufortforLOL-Light.ttf`),
      weight: 300,
      style: "normal",
    },
    {
      name: "Beautfort",
      data: await readFile(`${fontPath}/BeaufortForLoL-TTF/BeaufortforLOL-LightItalic.ttf`),
      weight: 300,
      style: "italic",
    },
    {
      name: "Beautfort",
      data: await readFile(`${fontPath}/BeaufortForLoL-TTF/BeaufortforLOL-Regular.ttf`),
      weight: 400,
      style: "normal",
    },
    {
      name: "Beautfort",
      data: await readFile(`${fontPath}/BeaufortForLoL-TTF/BeaufortforLOL-Italic.ttf`),
      weight: 400,
      style: "italic",
    },
    {
      name: "Beautfort",
      data: await readFile(`${fontPath}/BeaufortForLoL-TTF/BeaufortforLOL-Medium.ttf`),
      weight: 500,
      style: "normal",
    },
    {
      name: "Beautfort",
      data: await readFile(`${fontPath}/BeaufortForLoL-TTF/BeaufortforLOL-MediumItalic.ttf`),
      weight: 500,
      style: "italic",
    },
    {
      name: "Beautfort",
      data: await readFile(`${fontPath}/BeaufortForLoL-TTF/BeaufortforLOL-Bold.ttf`),
      weight: 700,
      style: "normal",
    },
    {
      name: "Beautfort",
      data: await readFile(`${fontPath}/BeaufortForLoL-TTF/BeaufortforLOL-BoldItalic.ttf`),
      weight: 700,
      style: "italic",
    },
    {
      name: "Beautfort",
      data: await readFile(`${fontPath}/BeaufortForLoL-TTF/BeaufortforLOL-Heavy.ttf`),
      weight: 800,
      style: "normal",
    },
    {
      name: "Beautfort",
      data: await readFile(`${fontPath}/BeaufortForLoL-TTF/BeaufortforLOL-HeavyItalic.ttf`),
      weight: 800,
      style: "italic",
    },
    {
      name: "Spiegel",
      data: await readFile(`${fontPath}/Spiegel-TTF/Spiegel_TT_Regular.ttf`),
      weight: 400,
      style: "normal",
    },
    {
      name: "Spiegel",
      data: await readFile(`${fontPath}/Spiegel-TTF/Spiegel_TT_Regular_Italic.ttf`),
      weight: 400,
      style: "italic",
    },
    {
      name: "Spiegel",
      data: await readFile(`${fontPath}/Spiegel-TTF/Spiegel_TT_SemiBold.ttf`),
      weight: 500,
      style: "normal",
    },
    {
      name: "Spiegel",
      data: await readFile(`${fontPath}/Spiegel-TTF/Spiegel_TT_SemiBold_Italic.ttf`),
      weight: 500,
      style: "italic",
    },
    {
      name: "Spiegel",
      data: await readFile(`${fontPath}/Spiegel-TTF/Spiegel_TT_Bold.ttf`),
      weight: 700,
      style: "normal",
    },
    {
      name: "Spiegel",
      data: await readFile(`${fontPath}/Spiegel-TTF/Spiegel_TT_Bold_Italic.ttf`),
      weight: 700,
      style: "italic",
    },
  ];
}
