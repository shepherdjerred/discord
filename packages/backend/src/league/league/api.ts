import { LolApi } from "twisted";
import configuration from "../../configuration.js";

export const api = new LolApi({
  key: configuration.riotApiToken,
  rateLimitRetry: true,
  rateLimitRetryAttempts: 3,
  concurrency: 1,
});
