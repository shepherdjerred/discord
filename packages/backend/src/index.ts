import "./db/index.js";
import "./discord/index.js";
import { startCronJobs } from "./league/cron.js";
import "./server/index.js";

startCronJobs();
