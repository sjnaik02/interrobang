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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Sparkles } from "lucide-react";
import { HexColorInput, HexColorPicker } from "react-colorful";

interface VisualizerProps {
  questionLabel: string;
  options: string[];
  data: {
    option: string;
    count: number;
    percentage: number;
  }[];
  type?: string;
  otherResponses?: { text: string; count: number }[];
}

const CHART_COLORS = [
  "#2C75FF", // Vibrant blue
  "#FB923C", // Light orange
  "#6366F1", // Indigo
  "#2DD4BF", // Teal
  "#F59E0B", // Gold
  "#0A2472", // Deep navy
  "#EF4444", // Coral red
  "#34D399", // Mint
  "#8B5CF6", // Purple
  "#89CFF0", // Light blue
  "#EC4899", // Pink
  "#059669", // Forest green
  "#48CAE4", // Sky blue
  "#A78BFA", // Lavender
  "#86EFD1", // Pale mint
  "#94A3B8",
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
      <DropdownMenuContent className="flex flex-col gap-2 p-4">
        <p className="text-sm font-medium">Pick a color</p>
        <HexColorPicker
          color={color}
          onChange={(color) => onColorChange(color)}
        />
        <HexColorInput
          color={color}
          onChange={(color) => onColorChange(color)}
        />
        <div className="grid grid-cols-4 gap-1">
          {CHART_COLORS.map((chartColor, i) => (
            <DropdownMenuItem
              key={i}
              className="flex aspect-square items-center justify-center border-2 border-black"
              style={{ backgroundColor: chartColor }}
              onClick={() => onColorChange(chartColor)}
            />
          ))}
        </div>
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
  textWidth,
  textSize,
}: {
  data: any[];
  chartWidth: number;
  barCategoryGap: number;
  textWidth: number;
  textSize: string;
}) => {
  const maxPercentage = Math.max(...data.map((d) => d.percentage));
  const yAxisMax = Math.ceil((maxPercentage + 10) / 10) * 10;

  return (
    <ResponsiveContainer width={chartWidth - 32} height={400}>
      <BarChart
        data={data}
        barGap={0}
        barCategoryGap={barCategoryGap}
        margin={{ top: 0, right: 0, bottom: 32, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
        <XAxis
          dataKey="option"
          interval={0}
          height={40}
          tick={({ x, y, payload }) => (
            <Text
              x={x}
              y={y}
              height={60}
              width={textWidth}
              textAnchor="middle"
              verticalAnchor="start"
              className={textSize}
              fill="#333333"
            >
              {payload.value}
            </Text>
          )}
        />
        <YAxis
          domain={[0, yAxisMax]}
          tickFormatter={(value) => `${value}%`}
          tick={{ fill: "#333333" }}
          dx={-10}
        />
        <Bar dataKey="percentage">
          {data.map((entry) => (
            <Cell key={entry.originalOption} fill={entry.color} />
          ))}
          <LabelList
            dataKey="percentage"
            position="top"
            formatter={(value: number) => `${value.toFixed(1)}%`}
            fill="#333333"
            dy={-10}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const RankingBarChartComponent = ({
  data,
  chartWidth,
  barCategoryGap,
  textWidth,
  textSize,
}: {
  data: any[];
  chartWidth: number;
  barCategoryGap: number;
  textWidth: number;
  textSize: string;
}) => {
  return (
    <ResponsiveContainer width={chartWidth - 32} height={400}>
      <BarChart
        data={data}
        barGap={0}
        barCategoryGap={barCategoryGap}
        margin={{ top: 0, right: 0, bottom: 32, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
        <XAxis
          dataKey="option"
          interval={0}
          height={60}
          tick={({ x, y, payload }) => (
            <Text
              x={x}
              y={y}
              height={40}
              width={textWidth}
              textAnchor="middle"
              verticalAnchor="start"
              className={textSize + " text-black"}
            >
              {payload.value}
            </Text>
          )}
        />
        <YAxis
          domain={[1, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
          tick={{ fill: "#333333" }}
          dx={-10}
        />
        <Bar dataKey="score">
          {data.map((entry) => (
            <Cell key={entry.originalOption} fill={entry.color} />
          ))}
          <LabelList
            dataKey="score"
            position="top"
            formatter={(value: number) => value.toFixed(2)}
            fill="#333333"
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
  data,
  type = "default",
  otherResponses,
}: VisualizerProps) {
  const [chartWidth, setChartWidth] = useState<number>(900);
  const [barCategoryGap, setBarCategoryGap] = useState<number>(45);
  const [textWidth, setTextWidth] = useState<number>(130);
  const [textSize, setTextSize] = useState<string>("text-sm");
  const ref = useRef<HTMLDivElement>(null);
  const [editableOptions, setEditableOptions] = useState<string[]>(options);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [optionColors, setOptionColors] = useState<string[]>(
    options.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]) as string[],
  );

  const chartData = useMemo(() => {
    return data.map(
      (
        answer: { count: number; percentage: number; score?: number },
        index: number,
      ) => ({
        option:
          editableOptions[index] +
          (type === "Ranking" ? "" : ` (${answer.count})`),
        originalOption: editableOptions[index],
        count: answer.count,
        score: answer.score,
        percentage: answer.percentage,
        color: optionColors[index],
      }),
    );
  }, [data, editableOptions, optionColors, type]);

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

  const quickFormat = () => {
    // Find the highest count
    const maxCount = Math.max(...data.map((item) => item.count));

    // Update colors - desaturate all except those with max count and make max count bars bolder
    setOptionColors((prev) => {
      return prev.map((color, index) => {
        if (data[index]?.count === maxCount) {
          // For max values, make color more saturated and brighter
          if (color.startsWith("hsl")) {
            return color.replace(/saturation/, "calc(var(--saturation) * 1.2)");
          } else if (color.startsWith("#")) {
            // For hex colors, increase saturation and brightness
            const r = parseInt(color.slice(1, 3), 16) / 255;
            const g = parseInt(color.slice(3, 5), 16) / 255;
            const b = parseInt(color.slice(5, 7), 16) / 255;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h = 0;
            let s = 0;
            const l = (max + min) / 2;

            if (max !== min) {
              const d = max - min;
              s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
              switch (max) {
                case r:
                  h = (g - b) / d + (g < b ? 6 : 0);
                  break;
                case g:
                  h = (b - r) / d + 2;
                  break;
                case b:
                  h = (r - g) / d + 4;
                  break;
              }
              h /= 6;
            }

            // Increase saturation by 20% and brightness slightly
            s = Math.min(1, s * 1.2);
            const l2 = Math.min(0.9, l * 1.1); // Increase brightness but cap at 0.9

            const toRGB = (p: number, q: number, t: number) => {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1 / 6) return p + (q - p) * 6 * t;
              if (t < 1 / 2) return q;
              if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
              return p;
            };

            const q = l2 < 0.5 ? l2 * (1 + s) : l2 + s - l2 * s;
            const p = 2 * l2 - q;

            const r2 = Math.round(toRGB(p, q, h + 1 / 3) * 255);
            const g2 = Math.round(toRGB(p, q, h) * 255);
            const b2 = Math.round(toRGB(p, q, h - 1 / 3) * 255);

            return `#${r2.toString(16).padStart(2, "0")}${g2.toString(16).padStart(2, "0")}${b2.toString(16).padStart(2, "0")}`;
          }
          return color;
        }

        // Desaturate non-max values
        if (color.startsWith("hsl")) {
          return color.replace(/saturation/, "calc(var(--saturation) * 0.3)");
        } else if (color.startsWith("#")) {
          const r = parseInt(color.slice(1, 3), 16) / 255;
          const g = parseInt(color.slice(3, 5), 16) / 255;
          const b = parseInt(color.slice(5, 7), 16) / 255;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          let h = 0;
          let s = 0;
          const l = (max + min) / 2;

          if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
              case g:
                h = (b - r) / d + 2;
                break;
              case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
          }

          // Reduce saturation by 70%
          s *= 0.3;

          const toRGB = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };

          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;

          const r2 = Math.round(toRGB(p, q, h + 1 / 3) * 255);
          const g2 = Math.round(toRGB(p, q, h) * 255);
          const b2 = Math.round(toRGB(p, q, h - 1 / 3) * 255);

          return `#${r2.toString(16).padStart(2, "0")}${g2.toString(16).padStart(2, "0")}${b2.toString(16).padStart(2, "0")}`;
        }
        return color; // Return unchanged if format not recognized
      });
    });
  };

  return (
    <>
      <div className="mx-auto flex gap-4">
        <Card className="flex w-full flex-col justify-center p-4">
          <div
            style={{ width: `${chartWidth}px` }}
            ref={ref}
            className="mx-auto h-fit bg-card"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="mr-4 text-3xl">{questionLabel}</CardTitle>
              <Image
                src="/tangle-gradient.png"
                alt="tangle logo"
                width={200}
                height={200}
              />
            </CardHeader>
            <CardContent className="flex pb-0">
              {type === "Ranking" ? (
                <RankingBarChartComponent
                  data={chartData}
                  chartWidth={chartWidth}
                  barCategoryGap={barCategoryGap}
                  textWidth={textWidth}
                  textSize={textSize}
                />
              ) : (
                <BarChartComponent
                  data={chartData}
                  chartWidth={chartWidth}
                  barCategoryGap={barCategoryGap}
                  textWidth={textWidth}
                  textSize={textSize}
                />
              )}
            </CardContent>
            <CardFooter className="flex flex-row justify-between pt-4">
              <p className="text-sm text-muted-foreground">Source: Tangle</p>
            </CardFooter>
          </div>
          {otherResponses && otherResponses.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground">Other responses:</p>
              <Table className="rounded-lg border border-muted">
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead>Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherResponses.map((response, index) => (
                    <TableRow key={response.text}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{response.text}</TableCell>
                      <TableCell>{response.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </Card>
        <Card className="flex h-fit w-full max-w-[300px] flex-col gap-2">
          <CardHeader className="flex justify-between">
            <CardTitle>Customize</CardTitle>
            <CardDescription>Customize your chart</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-scroll">
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                className="w-fit bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                onClick={quickFormat}
              >
                Quick Format <Sparkles className="ml-1 h-4 w-4" />
              </Button>
              <Label>Edit labels and colors</Label>
              {editableOptions.map((option, idx) => (
                <OptionInput
                  key={idx}
                  value={option}
                  index={idx}
                  onChange={handleOptionChange}
                  color={optionColors[idx] ?? "#000000"}
                  onColorChange={handleColorChange}
                />
              ))}
              <div className="flex items-center gap-2 pt-4">
                <Label>Chart settings</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => setShowOptions((prev) => !prev)}
                >
                  {showOptions ? "Hide" : "Show"}
                </Button>
              </div>
              {showOptions && (
                <>
                  <Label className="mt-2 text-sm">Label width</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={textWidth === 110 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextWidth(110)}
                    >
                      XS
                    </Button>
                    <Button
                      variant={textWidth === 120 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextWidth(120)}
                    >
                      Sm
                    </Button>
                    <Button
                      variant={textWidth === 130 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextWidth(130)}
                    >
                      Md
                    </Button>
                    <Button
                      variant={textWidth === 150 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextWidth(150)}
                    >
                      Lg
                    </Button>
                  </div>
                  <Label className="mt-2 text-sm">Label text size</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={textSize === "text-xs" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextSize("text-xs")}
                    >
                      Small
                    </Button>
                    <Button
                      variant={textSize === "text-sm" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextSize("text-sm")}
                    >
                      Medium
                    </Button>
                    <Button
                      variant={textSize === "text-base" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextSize("text-base")}
                    >
                      Large
                    </Button>
                  </div>
                  <Label className="mt-2 text-sm">
                    Chart width: {chartWidth}px
                  </Label>
                  <Slider
                    id="width"
                    value={[chartWidth]}
                    onValueChange={(e) => setChartWidth(e[0] ?? 0)}
                    defaultValue={[900]}
                    max={900}
                    min={650}
                    step={25}
                  />
                  <Label className="mt-2 text-sm">
                    Space between bars: {barCategoryGap}%
                  </Label>
                  <Slider
                    id="barCategoryGap"
                    value={[barCategoryGap]}
                    onValueChange={(e) => setBarCategoryGap(e[0] ?? 0)}
                    defaultValue={[45]}
                    max={75}
                    min={10}
                    step={5}
                  />
                </>
              )}
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
