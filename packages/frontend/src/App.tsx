import { KarmaReceived } from "@glitter-boys/data";
import { dataSource } from "./db/index.ts";
import _ from "lodash";
import { useState, useEffect } from "react";
import KarmaUser, { KarmaUserProps } from "./KarmaUser.tsx";

export default function App() {
  const [entries, setEntries] = useState<KarmaUserProps[] | undefined>(undefined);

  useEffect(() => {
    async function getEntries() {
      const entries = await getLeaderboard();
      setEntries(entries);
    }

    if (!entries) {
      getEntries();
    }
  }, [entries]);

  const listItems = _.map(entries, (entry) => {
    return <KarmaUser {...entry} />;
  });

  if (entries) {
    return (
      <>
        <h1>Karma Leaderboard</h1>
        <ol>{listItems}</ol>
      </>
    );
  } else {
    return (
      <>
        <h1>Karma Leaderboard</h1>
        Loading...
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
    // show ties
    if (value.karmaReceived !== prev) {
      rank++;
    }
    // make a copy of rank. I think this is required because the function is async?
    const myRank = rank;
    prev = value.karmaReceived;

    return {
      rank: myRank,
      id: value.id,
      karma: value.karmaReceived,
    };
  });
}
