import { z } from "https://esm.sh/zod@3.22.4";

export type GlitterTier = z.infer<typeof GlitterTierSchema>;
export const GlitterTierSchema = z.union([
  z.strictObject({
    display: z.literal("S++"),
    ordinal: z.literal(1),
  }),
  z.strictObject({
    display: z.literal("S"),
    ordinal: z.literal(2),
  }),
  z.strictObject({
    display: z.literal("A"),
    ordinal: z.literal(3),
  }),
  z.strictObject({
    display: z.literal("B"),
    ordinal: z.literal(4),
  }),
  z.strictObject({
    display: z.literal("C"),
    ordinal: z.literal(5),
  }),
  z.strictObject({
    display: z.literal("Debt"),
    ordinal: z.literal(6),
  }),
  z.strictObject({
    display: z.literal("F"),
    ordinal: z.literal(7),
  }),
  z.strictObject({
    display: z.literal("X"),
    ordinal: z.literal(8),
  }),
  z.strictObject({
    display: z.literal("?"),
    ordinal: z.literal(9),
  }),
  z.strictObject({
    display: z.literal("Valorant"),
    ordinal: z.literal(10),
  }),
]);
