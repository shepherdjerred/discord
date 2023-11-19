import { match } from "ts-pattern";
import { z } from "zod";

export type Lane = z.infer<typeof LaneSchema>;
export const LaneSchema = z.enum(["top", "jungle", "middle", "adc", "support"]);

export function parseLane(input: string): Lane | undefined {
  return match(input.toLowerCase())
    .returnType<Lane | undefined>()
    .with("middle", () => "middle")
    .with("top", () => "top")
    .with("jungle", () => "jungle")
    .with("bottom", () => "adc")
    .with("utility", () => "support")
    .otherwise(() => undefined);
}
