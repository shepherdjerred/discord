import { match } from "https://esm.sh/ts-pattern";
import { z } from "https://esm.sh/zod";

export type Team = z.infer<typeof TeamSchema>;
export const TeamSchema = z.enum(["red", "blue"]);

export function parseTeam(input: number): Team | undefined {
  return match(input)
    .returnType<Team | undefined>()
    .with(100, () => "blue")
    .with(200, () => "red")
    .otherwise(() => undefined);
}
