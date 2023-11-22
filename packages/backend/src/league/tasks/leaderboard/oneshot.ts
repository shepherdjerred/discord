import client from "../../../discord/client.js";
import { postLeaderboardMessage } from "./task.js";

await postLeaderboardMessage();
await client.destroy();
