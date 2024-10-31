/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Visualizer.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Text,
} from "recharts";
import {
  BarChart2,
  PieChart as PieChartIcon,
  BarChartHorizontal,
} from "lucide-react";

interface VisualizerProps {
  questionLabel: string;
  options: string[];
  answers: string[];
}

type ChartType = "vertical" | "horizontal" | "donut";

// Array of chart colors from Tailwind config
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function Visualizer({
  questionLabel,
  options,
  answers,
}: VisualizerProps) {
  const [chartType, setChartType] = useState<ChartType>("vertical");

  // Process data
  const data = options.map((option, index) => {
    const count = answers.filter((answer) => answer === option).length;
    return {
      option,
      count,
      percentage: (count / answers.length) * 100,
      color: CHART_COLORS[index % CHART_COLORS.length], // Cycle through colors
    };
  });

  // Shared tooltip content
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;

    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-lg">
        <p className="font-medium">{data.option}</p>
        <p>{data.percentage.toFixed(1)}%</p>
        <p className="text-sm text-muted-foreground">
          ({data.count} responses)
        </p>
      </div>
    );
  };

  const renderChart = () => {
    const maxPercentage = Math.max(...data.map((d) => d.percentage));

    const yAxisMax = Math.ceil((maxPercentage + 10) / 10) * 10;
    switch (chartType) {
      case "vertical":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              barGap={0} // Adjust gap between bars
              barCategoryGap="15%" // Adjust space between groups
            >
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="option"
                interval={0}
                height={60}
                tickMargin={20}
                tick={({ x, y, payload }) => {
                  return (
                    <Text
                      x={x}
                      y={y}
                      width={120}
                      textAnchor="middle"
                      verticalAnchor="start"
                    >
                      {payload.value}
                    </Text>
                  );
                }}
              />
              <YAxis
                domain={[0, yAxisMax]} // Dynamic max with padding
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: "hsl(var(--foreground))" }}
                dx={-10} // Pull axis labels in a bit
              />
              <Bar dataKey="percentage" radius={[12, 12, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.option} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="percentage"
                  position="top"
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  fill="hsl(var(--foreground))"
                  dy={-10} // Pull percentage up a bit
                />
                <LabelList
                  dataKey="count"
                  height={30}
                  dy={-10}
                  position="insideBottom"
                  formatter={(value: number) => `(${value})`}
                  fill="hsl(var(--background))"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "horizontal":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
              }}
              barGap={0} // Adjust gap between bars
              barCategoryGap="15%" // Adjust space between groups
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis
                type="category"
                dataKey="option"
                width={150}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <Tooltip content={CustomTooltip} />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.option} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="count"
                  position="center"
                  formatter={(value: number) => `(${value})`}
                  fill="hsl(var(--background))"
                />
                <LabelList
                  dataKey="percentage"
                  position="right"
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  fill="hsl(var(--foreground))"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "donut":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="percentage"
                nameKey="option"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.option} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={CustomTooltip} />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="hsl(var(--foreground))"
              >
                <tspan x="50%" dy="-0.6em" className="text-lg font-bold">
                  {answers.length}
                </tspan>
                <tspan x="50%" dy="1.2em" className="text-sm">
                  responses
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="flex gap-4">
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="mr-4">{questionLabel}</CardTitle>
          <Image
            src="/tangle-gradient.png"
            alt="tangle logo"
            width={200}
            height={200}
          />
        </CardHeader>
        <CardContent className="flex">{renderChart()}</CardContent>
        <CardFooter className="flex flex-row justify-between">
          <p className="text-sm text-muted-foreground">Source: Tangle</p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Edit Chart</CardTitle>
          <CardDescription>
            Customize the chart to your liking. NOTE: Horizontal and Donut
            charts are under development.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-x-2 whitespace-nowrap">
            <Button
              variant={chartType === "vertical" ? "default" : "outline"}
              onClick={() => setChartType("vertical")}
              size="sm"
              className="px-2 py-1 text-sm"
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Vertical
            </Button>
            <Button
              variant={chartType === "horizontal" ? "default" : "outline"}
              onClick={() => setChartType("horizontal")}
              size="sm"
              className="px-2 py-1 text-sm"
            >
              <BarChartHorizontal className="mr-2 h-4 w-4" />
              Horizontal
            </Button>
            <Button
              variant={chartType === "donut" ? "default" : "outline"}
              onClick={() => setChartType("donut")}
              size="sm"
              className="px-2 py-1 text-sm"
            >
              <PieChartIcon className="mr-2 h-4 w-4" />
              Pie Chart
            </Button>
          </div>
          <div className="flex flex-col gap-2"></div>
        </CardContent>
      </Card>
    </div>
  );
}
