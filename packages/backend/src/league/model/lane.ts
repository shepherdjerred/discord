import { match } from "ts-pattern";
import { z } from "zod";

export type Lane = z.infer<typeof LaneSchema>;
export const LaneSchema = z.enum(["top", "jungle", "middle", "adc", "support"]);

export function parseLane(input: string): Lane | undefined {
  return match(input)
    .returnType<Lane | undefined>()
    .with("MIDDLE", () => "middle")
    .with("TOP", () => "top")
    .with("JUNGLE", () => "jungle")
    .with("BOTTOM", () => "adc")
    .with("UTILITY", () => "support")
    .otherwise(() => undefined);
}
