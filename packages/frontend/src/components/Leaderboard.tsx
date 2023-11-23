import * as React from "react";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type Leaderboard, LeaderboardSchema, type LeaderboardEntry, rankToString } from "@glitter-boys/data";
import { P, match } from "ts-pattern";
import _ from "lodash";
import { addDays, formatDistance, isWithinInterval } from "date-fns";
import { useState, useEffect } from "react";

const columnHelper = createColumnHelper<LeaderboardEntry>();

const columns = [
  columnHelper.accessor("position", {
    header: () => "#",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("player.config.name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("leaguePointsDelta", {
    header: "LP Difference",
    cell: (info) =>
      match(info.getValue())
        .with(0, () => "-")
        .with(P.number.positive(), (value) => `+${value}`)
        .with(P.number.negative(), (value) => `${value}`)
        .run(),
  }),
  columnHelper.accessor((row) => row.player.currentRank, {
    header: "Rank",
    cell: (info) => rankToString(info.getValue()),
  }),
  columnHelper.accessor((row) => row.player, {
    header: "Games",
    cell: (info) =>
      info.getValue().currentRank.wins -
      info.getValue().config.league.initialRank.wins +
      (info.getValue().currentRank.losses - info.getValue().config.league.initialRank.losses),
  }),
  columnHelper.accessor((row) => row.player, {
    header: "Wins",
    cell: (info) => info.getValue().currentRank.wins - info.getValue().config.league.initialRank.wins,
  }),
  columnHelper.accessor((row) => row.player, {
    header: "Losses",
    cell: (info) => info.getValue().currentRank.losses - info.getValue().config.league.initialRank.losses,
  }),
  columnHelper.accessor((row) => row.player, {
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
const todayAtNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
const tomorrowAtNoon = addDays(todayAtNoon, 1);

let next: Date;

if (isWithinInterval(now, { start: todayAtNoon, end: tomorrowAtNoon })) {
  next = tomorrowAtNoon;
} else {
  next = todayAtNoon;
}

export function LeaderboardComponent() {
  const [leaderboard, setLeaderboard] = useState<Leaderboard | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const result = await fetch("https://prod.bucket.glitter-boys.com/leaderboard.json");
      const leaderboard: Leaderboard = LeaderboardSchema.parse(await result.json());
      setLeaderboard(leaderboard);
    })();
  }, []);

  const table = useReactTable<LeaderboardEntry>({
    data: leaderboard?.contents || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="container mx-auto">
        <hgroup className="">
          <h1 className="text-3xl">Leaderboard</h1>
          <p>
            Updated {leaderboard?.date !== undefined ? formatDistance(leaderboard.date, now) : ""} ago. Next update in{" "}
            {formatDistance(now, next)}.
          </p>
        </hgroup>
        <table className="overflow-auto text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4">
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
                  <td key={cell.id} className="p-4">
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
