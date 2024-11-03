/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Visualizer.tsx
"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
import { toPng } from "html-to-image";
import {
  BarChart2,
  PieChart as PieChartIcon,
  BarChartHorizontal,
  Download,
} from "lucide-react";

interface VisualizerProps {
  questionLabel: string;
  options: string[];
  answers: string[];
}

type ChartType = "vertical" | "horizontal" | "donut";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const OptionInput = ({
  value,
  index,
  onChange,
}: {
  value: string;
  index: number;
  onChange: (index: number, value: string) => void;
}) => {
  return (
    <div>
      <Label>Option {index + 1}</Label>
      <Input value={value} onChange={(e) => onChange(index, e.target.value)} />
    </div>
  );
};

export default function Visualizer({
  questionLabel,
  options,
  answers,
}: VisualizerProps) {
  const [chartType, setChartType] = useState<ChartType>("vertical");
  const [chartWidth, setChartWidth] = useState<number>(800);
  const [barCategoryGap, setBarCategoryGap] = useState<number>(15);
  const ref = useRef<HTMLDivElement>(null);
  const [editableOptions, setEditableOptions] = useState<string[]>(options);

  const data = useMemo(() => {
    return options.map((option, index) => {
      const count = answers.filter((answer) => answer === option).length;
      const displayOption = editableOptions[index] + " (" + count + ")";
      const color =
        CHART_COLORS[index % CHART_COLORS.length] ?? CHART_COLORS[0];
      return {
        option: displayOption,
        originalOption: option,
        count,
        percentage: (count / answers.length) * 100,
        color,
      };
    });
  }, [options, answers, editableOptions]);

  const handleOptionChange = useCallback((index: number, value: string) => {
    setEditableOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index] = value;
      return newOptions;
    });
  }, []);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) return;

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "new-survey-chart.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

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
          <ResponsiveContainer width={chartWidth} height={400}>
            <BarChart data={data} barGap={0} barCategoryGap={barCategoryGap}>
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="option"
                interval={0}
                height={60}
                tick={({ x, y, payload }) => (
                  <Text
                    x={x}
                    y={y}
                    width={120}
                    textAnchor="middle"
                    verticalAnchor="start"
                  >
                    {payload.value}
                  </Text>
                )}
              />
              <YAxis
                domain={[0, yAxisMax]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: "hsl(var(--foreground))" }}
                dx={-10}
              />
              <Bar dataKey="percentage" radius={[12, 12, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.originalOption} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="percentage"
                  position="top"
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  fill="hsl(var(--foreground))"
                  dy={-10}
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
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              barGap={0}
              barCategoryGap="15%"
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
                  <Cell key={entry.originalOption} fill={entry.color} />
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
                  <Cell key={entry.originalOption} fill={entry.color} />
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
    <>
      <div className="mx-auto flex gap-4">
        <Card ref={ref} className="w-full">
          <div style={{ width: `${chartWidth}px` }} className="mx-auto">
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
          </div>
        </Card>
        <Card className="flex w-96 flex-col gap-2">
          <CardHeader className="flex justify-between">
            <CardTitle>Customize</CardTitle>
            <CardDescription>Customize your chart</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={chartType === "vertical" ? "default" : "outline"}
                onClick={() => setChartType("vertical")}
                size="icon"
              >
                <BarChart2 className="" />
              </Button>
              <Button
                variant={chartType === "horizontal" ? "default" : "outline"}
                onClick={() => setChartType("horizontal")}
                size="icon"
              >
                <BarChartHorizontal />
              </Button>
              <Button
                variant={chartType === "donut" ? "default" : "outline"}
                onClick={() => setChartType("donut")}
                size="icon"
              >
                <PieChartIcon />
              </Button>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Label>Chart width</Label>
              <Slider
                id="width"
                value={[chartWidth]}
                onValueChange={(e) => setChartWidth(e[0] ?? 0)}
                defaultValue={[800]}
                max={900}
                min={500}
                step={25}
              />
              <Label>Width between bars</Label>
              <Slider
                id="barCategoryGap"
                value={[barCategoryGap]}
                onValueChange={(e) => setBarCategoryGap(e[0] ?? 0)}
                defaultValue={[15]}
                max={50}
                min={10}
                step={5}
              />
              {editableOptions.map((option, idx) => (
                <OptionInput
                  key={idx}
                  value={option}
                  index={idx}
                  onChange={handleOptionChange}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="default" onClick={onButtonClick} size="icon">
              <Download />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
