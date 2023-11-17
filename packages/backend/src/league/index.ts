import { CronJob } from "cron";
import { postUpdate } from "./leaderboard.js";
import { checkMatch } from "./match.js";
import { checkSpectate } from "./spectate.js";

// post leaderboard update once a day at noon
new CronJob("0 0 12 * * *", postUpdate, () => console.log("posted leaderboard update"), true, "America/Los_Angeles");
// check spectate status every minute
new CronJob("0 * * * * *", checkSpectate, () => console.log("checked spectate"), true, "America/Los_Angeles");
// check match status every minute
new CronJob("30 * * * * *", checkMatch, () => console.log("checked match"), true, "America/Los_Angeles");
