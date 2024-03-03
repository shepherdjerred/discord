import { z } from "https://esm.sh/zod@3.22.4";

// export declare enum Regions {
//   BRAZIL = "BR1",
//   EU_EAST = "EUN1",
//   EU_WEST = "EUW1",
//   KOREA = "KR",
//   LAT_NORTH = "LA1",
//   LAT_SOUTH = "LA2",
//   AMERICA_NORTH = "NA1",
//   OCEANIA = "OC1",
//   TURKEY = "TR1",
//   RUSSIA = "RU",
//   JAPAN = "JP1",
//   VIETNAM = "VN2",
//   TAIWAN = "TW2",
//   THAILAND = "TH2",
//   SINGAPORE = "SG2",
//   PHILIPPINES = "PH2",
//   PBE = "PBE1"
// }

export type LeagueAccount = z.infer<typeof LeagueAcccountSchema>;
export const LeagueAcccountSchema = z.strictObject({
  // AKA encrypted summoner ID
  id: z.string().min(0),
  accountId: z.string().min(0),
  puuid: z.string().min(0),
  region: z.enum([
    "BRAZIL",
    "EU_EAST",
    "EU_WEST",
    "KOREA",
    "LAT_NORTH",
    "LAT_SOUTH",
    "AMERICA_NORTH",
    "OCEANIA",
    "TURKEY",
    "RUSSIA",
    "JAPAN",
    "VIETNAM",
    "TAIWAN",
    "THAILAND",
    "SINGAPORE",
    "PHILIPPINES",
    "PBE",
  ]),
});
