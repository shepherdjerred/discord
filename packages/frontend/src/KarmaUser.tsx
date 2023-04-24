import { useEffect, useState } from "react";

export interface KarmaUserProps {
  rank: number;
  id: string;
  karma: number;
}

interface ApiValues {
  username: string;
  avatar: string;
}

export default function KarmaUser(props: KarmaUserProps) {
  const { id, rank, karma } = props;
  const [values, setValues] = useState<ApiValues | undefined>(undefined);

  useEffect(() => {
    async function getValues() {
      try {
        const data = await (await fetch(`https://discord-lookup-api.herokuapp.com/user/${id}`)).json();
        setValues({
          username: data["data"]["username"],
          avatar: data["data"]["avatar"],
        });
      } catch (err) {
        console.error(err);
      }
    }

    if (!values) {
      getValues();
    }
  }, [id, values]);

  if (values) {
    const { username, avatar } = values;
    return (
      <li key={id} value={rank}>
        {<img src={avatar} className="rounded" /> || <></>}
        {username} ({karma} karma)
      </li>
    );
  } else {
    return (
      <li key={id} value={rank}>
        Loading...
      </li>
    );
  }
}
