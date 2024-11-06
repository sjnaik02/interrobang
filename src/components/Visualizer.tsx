/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Text,
} from "recharts";
import { toPng } from "html-to-image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

interface VisualizerProps {
  questionLabel: string;
  options: string[];
  answers: string[];
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
  "hsl(var(--chart-11))",
  "hsl(var(--chart-12))",
  "hsl(var(--chart-13))",
  "hsl(var(--chart-14))",
  "hsl(var(--chart-15))",
  "hsl(var(--chart-16))",
];

const ColorPicker = ({
  color,
  onColorChange,
}: {
  color: string;
  onColorChange: (color: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          style={{ backgroundColor: color }}
          className="h-8 w-8 rounded-md border-2 border-black"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid grid-cols-4 gap-1">
        {CHART_COLORS.map((chartColor, i) => (
          <DropdownMenuItem
            key={i}
            className="flex aspect-square items-center justify-center border-2 border-black"
            style={{ backgroundColor: chartColor }}
            onClick={() => onColorChange(chartColor)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const OptionInput = ({
  value,
  index,
  onChange,
  color,
  onColorChange,
}: {
  value: string;
  index: number;
  onChange: (index: number, value: string) => void;
  color: string;
  onColorChange: (index: number, color: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <Label>Option {index + 1}</Label>
      <div className="flex items-center gap-2">
        <ColorPicker
          color={color}
          onColorChange={(color) => onColorChange(index, color)}
        />
        <Input
          value={value}
          onChange={(e) => onChange(index, e.target.value)}
        />
      </div>
    </div>
  );
};

const BarChartComponent = ({
  data,
  chartWidth,
  barCategoryGap,
}: {
  data: any[];
  chartWidth: number;
  barCategoryGap: number;
}) => {
  const maxPercentage = Math.max(...data.map((d) => d.percentage));
  const yAxisMax = Math.ceil((maxPercentage + 10) / 10) * 10;

  return (
    <ResponsiveContainer width={chartWidth} height={400}>
      <BarChart data={data} barGap={0} barCategoryGap={barCategoryGap}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
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
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default function Visualizer({
  questionLabel,
  options,
  answers,
}: VisualizerProps) {
  const [chartWidth, setChartWidth] = useState<number>(800);
  const [barCategoryGap, setBarCategoryGap] = useState<number>(15);
  const ref = useRef<HTMLDivElement>(null);
  const [editableOptions, setEditableOptions] = useState<string[]>(options);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [optionColors, setOptionColors] = useState<string[]>(
    options.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]) as string[],
  );

  const data = useMemo(() => {
    return options.map((option, index) => {
      const count = answers.filter((answer) => answer === option).length;
      const displayOption = editableOptions[index] + " (" + count + ")";
      return {
        option: displayOption,
        originalOption: option,
        count,
        percentage: (count / answers.length) * 100,
        color: optionColors[index],
      };
    });
  }, [options, answers, editableOptions, optionColors]);

  const handleOptionChange = useCallback((index: number, value: string) => {
    setEditableOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index] = value;
      return newOptions;
    });
  }, []);

  const handleColorChange = useCallback((index: number, color: string) => {
    setOptionColors((prev) => {
      const newColors = [...prev];
      newColors[index] = color;
      return newColors;
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

  return (
    <>
      <div className="mx-auto flex gap-4">
        <Card className="flex w-full justify-center">
          <div
            style={{ width: `${chartWidth}px` }}
            ref={ref}
            className="h-fit bg-card"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="mr-4">{questionLabel}</CardTitle>
              <Image
                src="/tangle-gradient.png"
                alt="tangle logo"
                width={200}
                height={200}
              />
            </CardHeader>
            <CardContent className="flex">
              <BarChartComponent
                data={data}
                chartWidth={chartWidth}
                barCategoryGap={barCategoryGap}
              />
            </CardContent>
            <CardFooter className="flex flex-row justify-between">
              <p className="text-sm text-muted-foreground">Source: Tangle</p>
            </CardFooter>
          </div>
        </Card>
        <Card className="flex w-full max-w-[300px] flex-col gap-2">
          <CardHeader className="flex justify-between">
            <CardTitle>Customize</CardTitle>
            <CardDescription>Customize your chart</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex flex-col gap-2">
              <Label className="mt-2 text-sm">
                Chart width: {chartWidth}px
              </Label>
              <Slider
                id="width"
                value={[chartWidth]}
                onValueChange={(e) => setChartWidth(e[0] ?? 0)}
                defaultValue={[700]}
                max={900}
                min={500}
                step={25}
              />
              <Label className="mt-2 text-sm">
                Width between bars: {barCategoryGap}%
              </Label>
              <Slider
                id="barCategoryGap"
                value={[barCategoryGap]}
                onValueChange={(e) => setBarCategoryGap(e[0] ?? 0)}
                defaultValue={[15]}
                max={50}
                min={10}
                step={5}
              />

              <div className="flex items-center gap-2 pt-4">
                <Label>Edit labels</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => setShowOptions((prev) => !prev)}
                >
                  {showOptions ? "Hide" : "Show"}
                </Button>
              </div>
              {showOptions &&
                editableOptions.map((option, idx) => (
                  <OptionInput
                    key={idx}
                    value={option}
                    index={idx}
                    onChange={handleOptionChange}
                    color={optionColors[idx] ?? "#000000"}
                    onColorChange={handleColorChange}
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
