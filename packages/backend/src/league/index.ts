import { CronJob } from "cron";
import { postLeaderboardMessage } from "./leaderboard.js";
import { checkPostMatch } from "./postmatch.js";
import { checkPreMatch } from "./prematch.js";

// post leaderboard update once a day at noon
new CronJob(
  "0 0 12 * * *",
  postLeaderboardMessage,
  () => console.log("posted leaderboard update"),
  true,
  "America/Los_Angeles",
);
// check spectate status every minute
new CronJob("0 * * * * *", checkPreMatch, () => console.log("checked spectate"), true, "America/Los_Angeles");
// check match status every minute
new CronJob("30 * * * * *", checkPostMatch, () => console.log("checked match"), true, "America/Los_Angeles");

await checkPreMatch();
await checkPostMatch();
