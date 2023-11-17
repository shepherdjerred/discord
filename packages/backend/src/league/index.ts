import { CronJob } from "cron";
import { postLeaderboardMessage } from "./leaderboard.js";
import { checkPostMatch } from "./postmatch.js";
import { checkPreMatch } from "./prematch.js";

// post leaderboard update once a day at noon
new CronJob(
  "0 0 12 * * *",
  () => {
    try {
      void postLeaderboardMessage();
    } catch (e) {
      console.error(e);
    }
  },
  () => console.log("posted leaderboard update"),
  true,
  "America/Los_Angeles",
);
// check spectate status every minute
new CronJob(
  "0 * * * * *",
  () => {
    try {
      void checkPreMatch();
    } catch (e) {
      console.error(e);
    }
  },
  () => console.log("checked spectate"),
  true,
  "America/Los_Angeles",
);
// check match status every minute
new CronJob(
  "30 * * * * *",
  () => {
    try {
      void checkPostMatch();
    } catch (e) {
      console.error(e);
    }
  },
  () => console.log("checked match"),
  true,
  "America/Los_Angeles",
);

try {
  await checkPreMatch();
  await checkPostMatch();
} catch (e) {
  console.error(e);
}
