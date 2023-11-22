import "./db/index.js";
import "./discord/index.js";
import { startCronJobs } from "./league/index.js";
import "./server/index.js";

startCronJobs();
