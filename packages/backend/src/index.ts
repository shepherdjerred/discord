import "./db/index.ts";
import "./discord/index.ts";
import { startCronJobs } from "./league/index.ts";
import "./server/index.ts";

startCronJobs();
