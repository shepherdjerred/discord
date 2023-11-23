import * as React from "react";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type Leaderboard, LeaderboardSchema, type LeaderboardEntry } from "@glitter-boys/data";

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
  }),
];

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
      <hgroup>
        <h1>Leaderboard</h1>
        <p>Updated {Date.now()}</p>
      </hgroup>
      <table className="table-auto">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
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
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
