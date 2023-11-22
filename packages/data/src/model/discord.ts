import { z } from "zod";

export type Discord = z.infer<typeof DiscordSchema>;
export const DiscordSchema = z.strictObject({
  id: z.string().min(0),
});
