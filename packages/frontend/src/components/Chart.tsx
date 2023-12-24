import * as React from "react";

import {
  type Leaderboard,
  LeaderboardSchema,
  type LeaderboardEntry,
  OldLeaderboardSchema,
  convertOldLeaderboard,
} from "@glitter-boys/data";
import _ from "lodash";
import { useState, useEffect } from "react";
import { scaleTime } from "@visx/scale";
import * as allCurves from "@visx/curve";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { extent } from "d3-array";
import { timeFormat } from "d3-time-format";
import { Axis, Orientation } from "@visx/axis";
import { scaleUtc, scaleLinear, coerceNumber } from "@visx/scale";

const width = 300;
const svgHeight = 300;
const scaleHeight = svgHeight - 30;
const lineHeight = svgHeight / 1;

export const backgroundColor = "#da7cff";
const axisColor = "#000";
export const labelColor = "#340098";
const tickLabelProps = {
  fill: "#000",
  fontSize: 12,
  fontFamily: "sans-serif",
  textAnchor: "middle",
} as const;

const getMinMax = (vals: (number | { valueOf(): number })[]) => {
  const numericVals = vals.map(coerceNumber);
  return [Math.min(...numericVals), Math.max(...numericVals)];
};
const dates = [
  "2023-11-23",
  "2023-11-24",
  "2023-11-25",
  "2023-11-26",
  "2023-11-27",
  "2023-11-28",
  "2023-11-29",
  "2023-11-30",
  "2023-12-01",
  "2023-12-04",
  "2023-12-05",
  "2023-12-06",
  "2023-12-07",
  "2023-12-08",
  "2023-12-11",
  "2023-12-12",
  "2023-12-13",
  "2023-12-14",
  "2023-12-15",
  "2023-12-18",
  "2023-12-19",
  "2023-12-20",
  "2023-12-21",
  "2023-12-22",
];

export function ChartComponent() {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);

  useEffect(() => {
    (async () => {
      const leaderboards = await Promise.all(
        _.map(dates, async (date): Promise<Leaderboard> => {
          const json = await (await fetch(`https://prod.bucket.glitter-boys.com/leaderboards/${date}.json`)).json();
          const result = LeaderboardSchema.safeParse(json);
          if (result.success) {
            return result.data;
          } else {
            return convertOldLeaderboard(OldLeaderboardSchema.parse(json));
          }
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

  xScale.range([0, width]);
  yScale.range([lineHeight - 2, 0]);

  const xAxis = {
    scale: scaleUtc({
      domain: getMinMax(_.map(allData, getX)),
      range: [0, width],
    }),
    values: _.chain(allData).map(getX).uniq().value(),
    tickFormat: (v: Date, i: number) => (i === 3 ? "🎉" : width > 400 || i % 2 === 0 ? timeFormat("%b %d")(v) : ""),
    label: "time",
  };

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
                x={(d) => xScale(getX(d))}
                y={(d) => yScale(getY(d))}
              />
            </Group>
          );
        })}
        <Axis
          orientation={Orientation.bottom}
          top={scaleHeight}
          scale={xAxis.scale}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={tickLabelProps}
          tickValues={xAxis.values}
          tickFormat={xAxis.tickFormat}
          numTicks={1}
          label={""}
          labelProps={{
            x: 0,
            y: 0,
            fill: labelColor,
            fontSize: 18,
            strokeWidth: 1,
            stroke: "#000",
            paintOrder: "stroke",
            fontFamily: "sans-serif",
            textAnchor: "start",
          }}
        />
      </svg>
    </>
  );
}
