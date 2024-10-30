/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Visualizer.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          <ResponsiveContainer width="50%" height={400}>
            <BarChart
              data={data}
              margin={{
                top: 40, // More top margin for labels
                right: 30,
                left: 40, // More left margin for Y-axis
                bottom: 60, // More bottom margin for labels
              }}
              barGap={0} // Adjust gap between bars
              barCategoryGap="20%" // Adjust space between groups
            >
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="option"
                tick={{ fill: "hsl(var(--foreground))" }}
                tickMargin={12} // More space for option labels
                dy={10} // Push labels down a bit
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
                  position="bottom"
                  formatter={(value: number) => `(${value})`}
                  fill="hsl(var(--muted-foreground))"
                  dy={50} // Push count down a bit
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "horizontal":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} layout="vertical">
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
              {/* Center text showing total responses */}
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
    <Card className="">
      <CardHeader>
        <CardTitle>{questionLabel}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        {renderChart()}
        <div className="space-x-2">
          <Button
            variant={chartType === "vertical" ? "default" : "outline"}
            onClick={() => setChartType("vertical")}
            size="sm"
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Vertical
          </Button>
          <Button
            variant={chartType === "horizontal" ? "default" : "outline"}
            onClick={() => setChartType("horizontal")}
            size="sm"
          >
            <BarChartHorizontal className="mr-2 h-4 w-4" />
            Horizontal
          </Button>
          <Button
            variant={chartType === "donut" ? "default" : "outline"}
            onClick={() => setChartType("donut")}
            size="sm"
          >
            <PieChartIcon className="mr-2 h-4 w-4" />
            Pie Chart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
