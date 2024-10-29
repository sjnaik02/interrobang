/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type Response } from "@/server/db/schema";

export function ResponsesChart({ responses }: { responses: Response[] }) {
  // Process responses into daily counts for last 7 days
  const chartData = React.useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date;
    }).reverse();

    // Create a map of dates to response counts
    const dailyCounts = days.map((date) => {
      const count = responses.filter((response) => {
        const responseDate = new Date(response.createdAt);
        return responseDate.toDateString() === date.toDateString();
      }).length;

      return {
        date: date.toISOString(),
        responses: count,
      };
    });

    return dailyCounts;
  }, [responses]);

  // Calculate total responses
  const total = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.responses, 0),
    [chartData],
  );

  const chartConfig = {
    responses: {
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
            Last 7 days: {total} responses
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={chartData}
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
                  nameKey="responses"
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
            <Area
              type="monotone"
              dataKey="responses"
              stroke={chartConfig.responses.color}
              fillOpacity={0.4}
              fill={chartConfig.responses.color}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
