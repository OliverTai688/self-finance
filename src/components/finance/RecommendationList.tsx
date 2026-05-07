"use client";

import { motion } from "motion/react";
import { AlertTriangle, ArrowRight, Lightbulb, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Recommendation } from "@/domain/types";

interface Props {
  recommendations: Recommendation[];
}

const PRIORITY_META = {
  1: {
    label: "立即處理",
    variant: "danger" as const,
    icon: AlertTriangle,
  },
  2: {
    label: "短期內處理",
    variant: "warning" as const,
    icon: Zap,
  },
  3: {
    label: "可規劃",
    variant: "secondary" as const,
    icon: Lightbulb,
  },
};

const LAYER_LABEL: Record<number, string> = {
  0: "整體",
  1: "L1 防禦",
  2: "L2 投資",
  3: "L3 收入",
};

export default function RecommendationList({ recommendations }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">下一步建議</CardTitle>
        <CardDescription>
          依優先順序排列；先補缺口、再談進攻。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.length === 0 && (
          <p className="text-sm text-muted-foreground">
            目前沒有需要立即處理的建議。系統會在你更新資料後重新評估。
          </p>
        )}
        {recommendations.map((rec, idx) => {
          const meta = PRIORITY_META[rec.priority];
          const Icon = meta.icon;
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="flex gap-3 rounded-xl border border-border bg-muted/20 p-4 hover:bg-muted/40 transition-colors"
            >
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
                <Icon size={16} className="text-foreground" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={meta.variant} className="rounded-md">
                    {meta.label}
                  </Badge>
                  <Badge variant="outline" className="rounded-md">
                    {LAYER_LABEL[rec.layer] ?? "整體"}
                  </Badge>
                  {rec.suggestedCashAllocationPct != null && (
                    <Badge variant="outline" className="rounded-md">
                      <ArrowRight size={10} className="mr-1" />
                      新增現金 {rec.suggestedCashAllocationPct}%
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-semibold leading-snug">
                  {rec.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {rec.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
