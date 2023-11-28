import { LolApi } from "https://esm.sh/twisted";
import configuration from "../../configuration.ts";

export const api = new LolApi({
  key: configuration.riotApiToken,
  rateLimitRetry: true,
  rateLimitRetryAttempts: 3,
  concurrency: 1,
});
