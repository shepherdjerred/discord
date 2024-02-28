import "./db/index.ts";
import "./discord/index.ts";
import { startCronJobs } from "./league/cron.ts";
import "./server/index.ts";

startCronJobs();
