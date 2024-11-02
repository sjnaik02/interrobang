/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// "use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Text } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

export const description = "A bar chart with a label";

type ChartData = {
  option: string;
  count: number;
  percentage: number;
  color: string | undefined;
}[];

const generateChartConfig = (data: ChartData) => {
  const chartConfig: ChartConfig = {};
  data.forEach((d) => {
    chartConfig[d.option] = {
      label: d.option,
      color: d.color,
    };
  });
  return chartConfig;
};

export const ChartBar = ({ data }: { data: ChartData }) => {
  const config = generateChartConfig(data);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Label</CardTitle>
        <CardDescription>
          Total responses: {data.reduce((acc, curr) => acc + curr.count, 0)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="min-h-[300px]">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="option"
              tickLine={false}
              tickMargin={10}
              height={60}
              axisLine={false}
              tick={({ x, y, payload }) => {
                return (
                  <Text
                    x={x}
                    y={y}
                    width={130}
                    textAnchor="middle"
                    verticalAnchor="start"
                    className="text-base text-foreground"
                  >
                    {payload.value}
                  </Text>
                );
              }}
            />
            <Bar dataKey="percentage" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={16}
                formatter={(value: number) => `${value.toFixed(1)}%`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </CardContent>
    </Card>
  );
};
