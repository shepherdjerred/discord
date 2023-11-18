import { createCanvas } from "canvas";
import _ from "lodash";
import { Match } from "./match.js";

// const matchObj = createMatchObject(exampleMatch);
// const result = matchToImage(matchObj);
// await writeFile("test.png", result);

export function matchToImage(match: Match) {
  const width = 1200;
  const height = 627;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.fillStyle = "#764abc";
  context.fillRect(0, 0, width, height);

  context.font = "bold 20pt 'PT Sans'";
  context.textAlign = "left";
  context.fillStyle = "#fff";

  const championNameOffset = 100;
  const spacing = 75;

  _.forEach(match.teams.red, (player, i) => {
    const offset = 100;

    context.fillText(player.champion, offset, (i + 1) * spacing);
    context.fillText(
      `${player.kills}/${player.deaths}/${player.assists}`,
      offset + championNameOffset,
      (i + 1) * spacing,
    );
  });

  _.forEach(match.teams.blue, (player, i) => {
    const offset = 500;
    context.fillText(player.champion, offset, (i + 1) * spacing);
    context.fillText(
      `${player.kills}/${player.deaths}/${player.assists}`,
      offset + championNameOffset,
      (i + 1) * spacing,
    );
  });

  context.fillText(match.outcome, 100, 500);

  return canvas.toBuffer("image/png");
}
