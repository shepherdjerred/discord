import { Division, Player, Rank, Tier } from "@glitter-boys/data";
import { describe, it, expect } from "vitest";
import { toLeaderboard } from "./index.js";
import _ from "lodash";

const createRank = ({ division, tier, lp }: { division: Division; tier: Tier; lp: number }): Rank => ({
  division,
  tier,
  lp,
  wins: 10,
  losses: 10,
});

const createPlayer = ({ name, currentRank }: { name: string; currentRank: Rank }): Player => ({
  config: {
    name,
    league: {
      leagueAccount: {
        id: "test",
        puuid: "test",
        accountId: "test",
      },
    },
    discordAccount: {
      id: "test",
    },
  },
  ranks: {
    solo: currentRank,
    flex: currentRank,
  },
});

describe("Leaderboard", () => {
  it("should return a correct leaderboard", () => {
    const players: Player[] = _.shuffle([
      createPlayer({
        name: "top of the leaderboard",
        currentRank: createRank({ division: 1, tier: "challenger", lp: 100 }),
      }),
      createPlayer({
        name: "bottom of the leaderboard",
        currentRank: createRank({ division: 4, tier: "iron", lp: 0 }),
      }),
      createPlayer({
        name: "positive",
        currentRank: createRank({ division: 3, tier: "silver", lp: 50 }),
      }),
      createPlayer({
        name: "negative",
        currentRank: createRank({ division: 2, tier: "bronze", lp: 50 }),
      }),
      createPlayer({
        name: "no change",
        currentRank: createRank({ division: 3, tier: "silver", lp: 50 }),
      }),
      createPlayer({
        name: "tied with next player",
        currentRank: createRank({ division: 1, tier: "silver", lp: 50 }),
      }),
      createPlayer({
        name: "tied with previous player",
        currentRank: createRank({ division: 3, tier: "silver", lp: 50 }),
      }),
    ]);

    expect(toLeaderboard(players)).toMatchSnapshot({
      date: expect.any(Date) as unknown,
    });
  });
});
