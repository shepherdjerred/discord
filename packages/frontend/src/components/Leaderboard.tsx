import * as React from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  type Leaderboard,
  LeaderboardSchema,
  type LeaderboardEntry,
  rankToString,
  wasPromoted,
  wasDemoted,
  rankToSimpleString,
  rankToLeaguePoints,
  type Player,
} from "@glitter-boys/data";
import { P, match } from "ts-pattern";
import _ from "lodash";
import { addDays, formatDistance, isWithinInterval } from "date-fns";
import { useState, useEffect } from "react";
import classnames from "classnames";

type HistoricalLeaderboard = HistoricalLeaderboardEntry[];
type HistoricalLeaderboardEntry = {
  current: LeaderboardEntry;
  previous: LeaderboardEntry | undefined;
};

const columnHelper = createColumnHelper<HistoricalLeaderboardEntry>();

const columns = [
  columnHelper.accessor("current.position", {
    header: () => "Position",
    cell: (info) => <span className="font-bold">#{info.renderValue()}</span>,
    id: "position",
  }),
  columnHelper.accessor("current.player.config.name", {
    header: "Person",
    cell: (info) => info.getValue(),
    id: "name",
  }),
  columnHelper.accessor("current.leaguePointsDelta", {
    header: "LP Difference",
    cell: (info) =>
      match(info.getValue())
        .with(0, () => "-")
        .with(P.number.positive(), (value) => `+${value}`)
        .with(P.number.negative(), (value) => `${value}`)
        .run(),
    id: "lp-difference",
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
    sortingFn: (a, b) => {
      const getVal = (info: HistoricalLeaderboardEntry) => {
        const previous = info.previous;
        if (previous === undefined) {
          return -9999;
        }
        return info.current.leaguePointsDelta - previous.leaguePointsDelta;
      };
      return (
        getVal(a.getValue("lp-difference-since-last-update")) - getVal(b.getValue("lp-difference-since-last-update"))
      );
    },
    id: "lp-difference-since-last-update",
  }),
  columnHelper.accessor((row) => row.current.player.currentRank, {
    header: "Rank",
    cell: (info) => rankToString(info.getValue()),
    id: "rank",
    sortingFn: (a, b) => rankToLeaguePoints(a.getValue("rank")) - rankToLeaguePoints(b.getValue("rank")),
  }),
  columnHelper.accessor((row) => row.current.player, {
    header: "Games",
    cell: (info) =>
      info.getValue().currentRank.wins -
      info.getValue().config.league.initialRank.wins +
      (info.getValue().currentRank.losses - info.getValue().config.league.initialRank.losses),
    id: "games",
    sortingFn: (a, b) => {
      const getVal = (info: Player) => {
        return (
          info.currentRank.wins -
          info.config.league.initialRank.wins +
          (info.currentRank.losses - info.config.league.initialRank.losses)
        );
      };
      return getVal(a.getValue("games")) - getVal(b.getValue("games"));
    },
  }),
  columnHelper.accessor((row) => row.current.player, {
    header: "Wins",
    cell: (info) => info.getValue().currentRank.wins - info.getValue().config.league.initialRank.wins,
    id: "wins",
    sortingFn: (a, b) => {
      const getVal = (info: Player) => {
        return info.currentRank.wins - info.config.league.initialRank.wins;
      };
      return getVal(a.getValue("wins")) - getVal(b.getValue("wins"));
    },
  }),
  columnHelper.accessor((row) => row.current.player, {
    header: "Losses",
    cell: (info) => info.getValue().currentRank.losses - info.getValue().config.league.initialRank.losses,
    id: "losses",
    sortingFn: (a, b) => {
      const getVal = (info: Player) => {
        return info.currentRank.losses - info.config.league.initialRank.losses;
      };
      return getVal(a.getValue("losses")) - getVal(b.getValue("losses"));
    },
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
    id: "win-rate",
    sortingFn: (a, b) => {
      const getVal = (info: Player) => {
        const percent = _.round(
          ((info.currentRank.wins - info.config.league.initialRank.wins) /
            (info.currentRank.wins -
              info.config.league.initialRank.wins +
              (info.currentRank.losses - info.config.league.initialRank.losses))) *
            100,
        );
        return percent ? percent : -9999;
      };
      return getVal(a.getValue("win-rate")) - getVal(b.getValue("win-rate"));
    },
  }),
];

const now = new Date();
// TODO: this should be PST
const todayAtNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
const tomorrowAtNoon = addDays(todayAtNoon, 1);
// 3am CT
const end = new Date(2024, 1, 3, 3, 0, 0);

let next: Date;

if (isWithinInterval(now, { start: todayAtNoon, end: tomorrowAtNoon })) {
  next = tomorrowAtNoon;
} else {
  next = todayAtNoon;
}

function gameCount(leaderboard: HistoricalLeaderboardEntry): number | undefined {
  if (leaderboard.previous === undefined) {
    return undefined;
  }
  return (
    leaderboard.current.player.currentRank.wins -
    leaderboard.previous.player.currentRank.wins +
    (leaderboard.current.player.currentRank.losses - leaderboard.previous.player.currentRank.losses)
  );
}

export function LeaderboardComponent() {
  const [currentLeaderboard, setCurrentLeaderboard] = useState<Leaderboard | undefined>(undefined);
  const [leaderboard, setLeaderboard] = useState<HistoricalLeaderboard | undefined>(undefined);
  const [events, setEvents] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "position",
      desc: false,
    },
  ]);

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

      const promotions = _.flatMap(historical, (entry) => {
        if (entry.previous === undefined) {
          return [];
        }
        if (wasPromoted(entry.previous.player.currentRank, entry.current.player.currentRank)) {
          return [
            `${entry.current.player.config.name} was promoted: ${rankToSimpleString(
              entry.previous.player.currentRank,
            )} -> ${rankToSimpleString(entry.current.player.currentRank)}`,
          ];
        } else {
          return [];
        }
      });
      const demotions = _.flatMap(historical, (entry) => {
        if (entry.previous === undefined) {
          return [];
        }
        if (wasDemoted(entry.previous.player.currentRank, entry.current.player.currentRank)) {
          return [
            `${entry.current.player.config.name} was demoted: ${rankToSimpleString(
              entry.previous.player.currentRank,
            )} -> ${rankToSimpleString(entry.current.player.currentRank)}`,
          ];
        } else {
          return [];
        }
      });
      const games = _.flatMap(historical, (entry) => {
        const count = gameCount(entry);
        if (count === undefined) {
          return [];
        }
        if (count > 10) {
          return [`${entry.current.player.config.name} played ${count} games`];
        }
        return [];
      });
      setEvents([...promotions, ...demotions, ...games].sort());

      setLeaderboard(historical);
    })();
  }, []);

  const table = useReactTable<HistoricalLeaderboardEntry>({
    data: leaderboard || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="p-4">
          <hgroup className="">
            <h1 className="text-3xl">Leaderboard</h1>
            <p>
              Updated {currentLeaderboard?.date !== undefined ? formatDistance(currentLeaderboard.date, now) : ""} ago.
              Next update in {formatDistance(now, next)}. Competition ends in {formatDistance(now, end)}.
            </p>
          </hgroup>
          <table className="overflow-auto text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-2 bg-gray-100 dark:bg-black">
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={classnames({ "p-2": true, border: true })}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4">
          <hgroup>
            <h2 className="text-3xl">Recent Events</h2>
          </hgroup>
          <ul className="list-disc list-inside">
            {events.map((event) => (
              <li>{event}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
