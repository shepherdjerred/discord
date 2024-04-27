import * as Sentry from "https://deno.land/x/sentry/index.mjs";

Sentry.init({
  dsn: configuration.sentryDsn,
  environment: configuration.environment,
  release: configuration.gitSha,
});

import "./db/mod.ts";
import "./discord/mod.ts";
import { startCronJobs } from "./league/cron.ts";
import "./server/mod.ts";
import configuration from "./configuration.ts";

startCronJobs();
