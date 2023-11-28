import { LolApi } from "https://esm.sh/twisted@1.55.0";
import configuration from "../../configuration.ts";

export const api = new LolApi({
  key: configuration.riotApiToken,
  rateLimitRetry: true,
  rateLimitRetryAttempts: 3,
  concurrency: 1,
});
