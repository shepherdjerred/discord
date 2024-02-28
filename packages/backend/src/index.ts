<<<<<<< HEAD
import "./db/index.ts";
import "./discord/index.ts";
import { startCronJobs } from "./league/index.ts";
import "./server/index.ts";
||||||| 1e5c8ed
import "./db/index.js";
import "./discord/index.js";
import { startCronJobs } from "./league/index.js";
import "./server/index.js";
=======
import "./db/index.js";
import "./discord/index.js";
import { startCronJobs } from "./league/cron.js";
import "./server/index.js";
>>>>>>> main

startCronJobs();
