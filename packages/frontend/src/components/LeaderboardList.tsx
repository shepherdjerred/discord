import _ from "lodash";
import LeaderboardEntry from "./LeaderboardEntry.tsx";

export interface LeaderboardListProps {
  users: LeaderboardUser[];
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  karma: number;
}

export function LeaderboardList(props: LeaderboardListProps) {
  const entries = _.map(props.users, (user) => {
    return <LeaderboardEntry key={user.id} {...user} />;
  });

  return <ol className="list-decimal">{entries}</ol>;
}
