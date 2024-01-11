import { z } from "zod";
import { RankSchema } from "../rank.js";
import { PlayerConfigEntrySchema } from "../playerConfigEntry.js";
import { PlayerWithSoloQueueRank } from "../player.js";

export type OldPlayer = z.infer<typeof OldPlayerSchema>;
export const OldPlayerSchema = z.strictObject({
  config: PlayerConfigEntrySchema,
  currentRank: RankSchema,
});

export function convertOldPlayer(oldPlayer: OldPlayer): PlayerWithSoloQueueRank {
  return {
    config: oldPlayer.config,
    ranks: {
      solo: oldPlayer.currentRank,
    },
  };
}
