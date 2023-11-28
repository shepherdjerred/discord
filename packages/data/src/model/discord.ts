import { z } from "https://esm.sh/zod";

export type Discord = z.infer<typeof DiscordSchema>;
export const DiscordSchema = z.strictObject({
  id: z.string().min(0),
});
