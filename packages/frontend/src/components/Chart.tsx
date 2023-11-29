import * as React from "react";

import { type Leaderboard, LeaderboardSchema, type LeaderboardEntry } from "@glitter-boys/data";
import _ from "lodash";
import { useState, useEffect } from "react";
import { scaleTime, scaleLinear } from "@visx/scale";
import * as allCurves from "@visx/curve";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { extent } from "d3-array";

const dates = ["2023-11-23", "2023-11-24", "2023-11-25", "2023-11-26", "2023-11-27", "2023-11-28"];

export function ChartComponent() {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);

  useEffect(() => {
    (async () => {
      const leaderboards = await Promise.all(
        _.map(dates, async (date) => {
          return LeaderboardSchema.parse(
            await (await fetch(`https://prod.bucket.glitter-boys.com/leaderboards/${date}.json`)).json(),
          );
        }),
      );
      setLeaderboards(leaderboards);
    })();
  }, []);

  type ChartEntry = {
    date: Date;
    content: LeaderboardEntry;
  };

  const grouped: Record<string, ChartEntry[]> = _.chain(leaderboards)
    .flatMap((leaderboard) => {
      return _.map(leaderboard.contents, (content): ChartEntry => {
        return {
          date: leaderboard.date,
          content,
        };
      });
    })
    .groupBy((leaderboard) => leaderboard.content.player.config.name)
    .value();

  const allData: ChartEntry[] = _.chain(grouped).values().flatMap().value();

  const getX = (d: ChartEntry): Date => d.date;
  const getY = (d: ChartEntry): number => d.content.leaguePointsDelta;

  const xScale = scaleTime<number>({
    domain: extent(allData, getX) as [Date, Date],
  });
  const yScale = scaleLinear<number>({
    domain: extent(allData, getY) as [number, number],
  });

  const width = 200;
  const svgHeight = 300;
  const lineHeight = svgHeight / 1;

  xScale.range([0, width]);
  yScale.range([lineHeight - 2, 0]);

  return (
    <>
      <svg width={width} height={svgHeight}>
        <rect width={width} height={svgHeight} fill="#efefef" />
        {_.map(grouped, (entries, name) => {
          return (
            <Group key={name}>
              <LinePath
                curve={allCurves.curveBasis}
                data={entries}
                stroke="#333"
                strokeWidth={2}
                markerMid="url(#marker-arrow)"
                x={(d) => xScale(getX(d)) ?? 0}
                y={(d) => yScale(getY(d)) ?? 0}
              />
            </Group>
          );
        })}
      </svg>
    </>
  );
}
