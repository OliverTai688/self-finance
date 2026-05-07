"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
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
import { formatMoneyCompact } from "@/lib/money";
import type { Currency, TargetAnalysis } from "@/domain/types";

interface Props {
  targets: TargetAnalysis;
  currentInvestableAssets: number;
  currency: Currency;
}

const chartConfig = {
  required: { label: "所需資產 (基準)", color: "var(--chart-1)" },
  current: { label: "目前可投資資產", color: "var(--chart-3)" },
} satisfies ChartConfig;

export default function TargetGapChart({
  targets,
  currentInvestableAssets,
  currency,
}: Props) {
  const data = [
    {
      mode: "一人生活",
      required: targets.requiredAssetsBaseSingle,
      gap: targets.fundingGapSingle,
    },
    {
      mode: "三人生活",
      required: targets.requiredAssetsBaseThree,
      gap: targets.fundingGapThreePeople,
    },
    {
      mode: "歐洲模式",
      required: targets.requiredAssetsBaseEurope,
      gap: targets.fundingGapEurope,
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>目標資產缺口</CardTitle>
        <CardDescription>
          以 3.7% 提領率為基準計算（保守 3.5% / 進取 4%）
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart
            data={data}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="mode"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={60}
              tickFormatter={(v) => formatMoneyCompact(v, currency)}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.3 }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-muted-foreground">
                        {String(name)}
                      </span>
                      <span className="font-mono font-semibold tabular-nums">
                        {formatMoneyCompact(Number(value), currency)}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="required" radius={[8, 8, 0, 0]}>
              {data.map((d) => (
                <Cell
                  key={d.mode}
                  fill={
                    d.gap === 0 ? "var(--chart-4)" : "var(--chart-1)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          {data.map((d) => (
            <div
              key={d.mode}
              className="rounded-lg border border-border bg-muted/30 p-3"
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {d.mode} · 缺口
              </p>
              <p className="mt-1 text-sm font-semibold tabular-nums">
                {d.gap === 0
                  ? "已達標"
                  : formatMoneyCompact(d.gap, currency)}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          目前可投資資產：{formatMoneyCompact(currentInvestableAssets, currency)}
        </p>
      </CardContent>
    </Card>
  );
}
