import { z } from "zod";
import { LeagueOfLegendsSchema } from "./LeagueOfLegends";

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.strictObject({
  leagueOfLegends: LeagueOfLegendsSchema,
});
