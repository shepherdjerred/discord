import * as React from "react";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type Leaderboard, LeaderboardSchema, type LeaderboardEntry, rankToString } from "@glitter-boys/data";
import { P, match } from "ts-pattern";
import _ from "lodash";
import { addDays, formatDistance, isWithinInterval, subDays } from "date-fns";

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
    header: "LP Delta",
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
const yesterdayAtNoon = subDays(todayAtNoon, 1);
const tomorrowAtNoon = addDays(todayAtNoon, 1);

let previous: Date;
let next: Date;

if (isWithinInterval(now, { start: todayAtNoon, end: tomorrowAtNoon })) {
  previous = todayAtNoon;
  next = tomorrowAtNoon;
} else {
  previous = yesterdayAtNoon;
  next = todayAtNoon;
}

const result = await fetch("https://prod.bucket.glitter-boys.com/leaderboard.json");
const leaderboard: Leaderboard = LeaderboardSchema.parse(await result.json());

export function LeaderboardComponent() {
  const table = useReactTable<LeaderboardEntry>({
    data: leaderboard,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <hgroup className="text-center">
          <h1 className="text-3xl">Leaderboard</h1>
          <p>
            Updated {formatDistance(previous, now)} ago. Next update in {formatDistance(now, next)}.
          </p>
        </hgroup>
        <div>
          <table className="table-auto text-center">
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
            <tbody className="p-10">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
