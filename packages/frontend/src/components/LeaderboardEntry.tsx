import { useEffect, useState } from "react";
import { LeaderboardUser } from "./LeaderboardList.js";
import { Spinner } from "./Spinner.tsx";

interface User {
  username: string;
  avatar: string;
}

export default function LeaderboardEntry(props: LeaderboardUser) {
  const { id, rank, karma } = props;
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    async function getValues() {
      console.log(`GETTING FOR ${id}`);
      try {
        const data = await (await fetch(`https://discord-lookup-api.herokuapp.com/user/${id}`)).json();
        setUser({
          username: data["data"]["username"],
          avatar: data["data"]["avatar"],
        });
      } catch (err) {
        console.error(err);
      }
    }

    getValues();
  }, []);

  if (user) {
    const { username, avatar } = user;
    return (
      <li key={id} value={rank}>
        <img src={avatar} className="rounded-full inline w-10" />
        {username} <Karma amount={karma} />
      </li>
    );
  } else {
    return (
      <li key={id} value={rank}>
        <span className="w-10 inline-block">
          <Spinner />
          <Karma amount={karma} />
        </span>
      </li>
    );
  }
}

function Karma(props: { amount: number }) {
  return <span className="text-sm">({props.amount} karma)</span>;
}
