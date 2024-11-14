/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function ResponsesChart({
  responseCount,
}: {
  responseCount: { date: string; count: number }[];
}) {
  // Fill in missing dates with 0 responses
  const filledResponseCount = useMemo(() => {
    const dates = new Set(responseCount.map((r) => r.date));
    const allDates = [];
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 13); // Last 14 days

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      allDates.push({
        date: dateStr,
        count: dates.has(dateStr!)
          ? (responseCount.find((r) => r.date === dateStr)?.count ?? 0)
          : 0,
      });
    }
    return allDates;
  }, [responseCount]);

  const total = filledResponseCount.reduce(
    (acc, curr) => acc + Number(curr.count),
    0,
  );

  const chartConfig = {
    count: {
      label: "Responses",
      color: "#2563eb",
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Daily Responses</CardTitle>
          <p className="text-sm text-muted-foreground">
            Last 14 days: {total} responses
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={filledResponseCount}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="count"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="count" fill={chartConfig.count.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
