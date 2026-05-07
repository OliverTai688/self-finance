"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const data = [
  { month: "Nov", income: 7800, expense: 3100 },
  { month: "Dec", income: 8100, expense: 4300 },
  { month: "Jan", income: 8300, expense: 3600 },
  { month: "Feb", income: 8500, expense: 3800 },
  { month: "Mar", income: 9200, expense: 3400 },
  { month: "Apr", income: 8500, expense: 3240 },
];

const chartConfig = {
  income: { label: "Income", color: "var(--chart-1)" },
  expense: { label: "Expense", color: "var(--chart-2)" },
} satisfies ChartConfig;

export default function CashflowChart() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Cashflow</CardTitle>
        <CardDescription>Last 6 months · income vs expense</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fill-income" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-income)" stopOpacity={0.45} />
                <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fill-expense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-expense)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-expense)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={42}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="var(--color-income)"
              strokeWidth={2}
              fill="url(#fill-income)"
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="var(--color-expense)"
              strokeWidth={2}
              fill="url(#fill-expense)"
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
