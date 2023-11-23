import * as React from "react";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type Leaderboard, LeaderboardSchema, type LeaderboardEntry, rankToString } from "@glitter-boys/data";
import { P, match } from "ts-pattern";
import _ from "lodash";
import { addDays, formatDistance, isWithinInterval } from "date-fns";
import { useState, useEffect } from "react";

type HistoricalLeaderboard = HistoricalLeaderboardEntry[];
type HistoricalLeaderboardEntry = {
  current: LeaderboardEntry;
  previous: LeaderboardEntry | undefined;
};

const columnHelper = createColumnHelper<HistoricalLeaderboardEntry>();

const columns = [
  columnHelper.accessor("current.position", {
    header: () => "#",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("current.player.config.name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("current.leaguePointsDelta", {
    header: "LP Difference",
    cell: (info) =>
      match(info.getValue())
        .with(0, () => "-")
        .with(P.number.positive(), (value) => `+${value}`)
        .with(P.number.negative(), (value) => `${value}`)
        .run(),
  }),
  columnHelper.accessor((row) => row, {
    header: "Change since last update",
    cell: (info) => {
      const previous = info.getValue().previous;
      if (previous === undefined) {
        return "-";
      }
      return match(info.getValue().current.leaguePointsDelta - previous.leaguePointsDelta)
        .with(0, () => "-")
        .with(P.number.positive(), (value) => `+${value}`)
        .with(P.number.negative(), (value) => `${value}`)
        .run();
    },
  }),
  columnHelper.accessor((row) => row.current.player.currentRank, {
    header: "Rank",
    cell: (info) => rankToString(info.getValue()),
  }),
  columnHelper.accessor((row) => row.current.player, {
    header: "Games",
    cell: (info) =>
      info.getValue().currentRank.wins -
      info.getValue().config.league.initialRank.wins +
      (info.getValue().currentRank.losses - info.getValue().config.league.initialRank.losses),
  }),
  columnHelper.accessor((row) => row.current.player, {
    header: "Wins",
    cell: (info) => info.getValue().currentRank.wins - info.getValue().config.league.initialRank.wins,
  }),
  columnHelper.accessor((row) => row.current.player, {
    header: "Losses",
    cell: (info) => info.getValue().currentRank.losses - info.getValue().config.league.initialRank.losses,
  }),
  columnHelper.accessor((row) => row.current.player, {
    header: "Win Rate",
    cell: (info) => {
      const percent = _.round(
        ((info.getValue().currentRank.wins - info.getValue().config.league.initialRank.wins) /
          (info.getValue().currentRank.wins -
            info.getValue().config.league.initialRank.wins +
            (info.getValue().currentRank.losses - info.getValue().config.league.initialRank.losses))) *
          100,
      );
      return percent ? `${percent}%` : "-";
    },
  }),
];

const now = new Date();
// TODO: this should be PST
const todayAtNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
const tomorrowAtNoon = addDays(todayAtNoon, 1);

let next: Date;

if (isWithinInterval(now, { start: todayAtNoon, end: tomorrowAtNoon })) {
  next = tomorrowAtNoon;
} else {
  next = todayAtNoon;
}

export function LeaderboardComponent() {
  const [currentLeaderboard, setCurrentLeaderboard] = useState<Leaderboard | undefined>(undefined);
  const [leaderboard, setLeaderboard] = useState<HistoricalLeaderboard | undefined>(undefined);

  useEffect(() => {
    (async () => {
      let result = await fetch("https://prod.bucket.glitter-boys.com/leaderboard.json");
      const currentLeaderboard = LeaderboardSchema.parse(await result.json());
      setCurrentLeaderboard(currentLeaderboard);

      result = await fetch("https://prod.bucket.glitter-boys.com/previous.json");
      const previousLeaderboard = LeaderboardSchema.parse(await result.json());

      const historical: HistoricalLeaderboardEntry[] = _.chain(currentLeaderboard.contents)
        .map((entry) => {
          const player = entry.player.config.name;
          const previous = _.find(previousLeaderboard.contents, (entry) => entry.player.config.name === player);
          return {
            current: entry,
            previous,
          };
        })
        .value();

      setLeaderboard(historical);
    })();
  }, []);

  const table = useReactTable<HistoricalLeaderboardEntry>({
    data: leaderboard || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="container mx-auto">
        <hgroup className="">
          <h1 className="text-3xl">Leaderboard</h1>
          <p>
            Updated {currentLeaderboard?.date !== undefined ? formatDistance(currentLeaderboard.date, now) : ""} ago.
            Next update in {formatDistance(now, next)}.
          </p>
        </hgroup>
        <table className="overflow-auto text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
