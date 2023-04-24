import { KarmaReceived } from "@glitter-boys/data";
import _ from "lodash";
import { useState, useEffect } from "react";
import { dataSource } from "../db/index.js";
import { Spinner } from "../components/Spinner.tsx";
import { LeaderboardList, LeaderboardUser } from "../components/LeaderboardList.tsx";

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardUser[] | undefined>(undefined);

  useEffect(() => {
    async function getEntries() {
      const entries = await getLeaderboard();
      setEntries(entries);
    }

    getEntries();
  }, []);

  const header = <h1 className="text-3xl font-bold font-serif mb-5">Karma Leaderboard</h1>;

  if (entries) {
    return (
      <>
        {header}
        <LeaderboardList users={entries} />
      </>
    );
  } else {
    return (
      <>
        {header}
        <Spinner />
      </>
    );
  }
}

async function getLeaderboard() {
  const karmaCounts = await dataSource.getRepository(KarmaReceived).find({
    select: {
      id: true,
      karmaReceived: true,
    },
  });

  let rank = 0;
  let prev: number;

  return _.map(karmaCounts, (value) => {
    if (value.karmaReceived !== prev) {
      rank++;
    }
    const myRank = rank;
    prev = value.karmaReceived;

    return {
      rank: myRank,
      id: value.id,
      karma: value.karmaReceived,
    };
  });
}
