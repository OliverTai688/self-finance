"use client";

import { motion } from "motion/react";
import { Shield, TrendingUp, Rocket, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LayerScoreCardProps {
  layer: 1 | 2 | 3;
  score: number;
  title: string;
  subtitle: string;
  highlights: { label: string; value: string }[];
  className?: string;
  delay?: number;
}

const LAYER_META: Record<
  1 | 2 | 3,
  { icon: LucideIcon; color: string; bg: string; border: string }
> = {
  1: {
    icon: Shield,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  2: {
    icon: TrendingUp,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  3: {
    icon: Rocket,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
};

export default function LayerScoreCard({
  layer,
  score,
  title,
  subtitle,
  highlights,
  className,
  delay = 0,
}: LayerScoreCardProps) {
  const meta = LAYER_META[layer];
  const Icon = meta.icon;
  const clamped = Math.max(0, Math.min(100, score));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className="flex h-full"
    >
      <div
        className={cn(
          "relative flex flex-col w-full glass-card group overflow-hidden rounded-[2rem]",
          className,
        )}
      >
        {/* Background Glow */}
        <div className={cn(
          "absolute -right-8 -top-8 size-32 rounded-full blur-3xl opacity-20 transition-all duration-700 group-hover:scale-150 group-hover:opacity-30",
          meta.bg
        )} />

        <CardContent className="relative z-10 flex flex-col gap-5 p-7 h-full">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-3">
              <div
                className={cn(
                  "flex size-14 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:rotate-6",
                  meta.bg,
                  meta.border,
                  meta.color
                )}
              >
                <Icon size={28} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">
                  L{layer} Layer
                </p>
                <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter tabular-nums text-foreground">
                  {clamped.toFixed(0)}
                </span>
                <span className="text-xs font-bold text-muted-foreground/50">/100</span>
              </div>
              <div className={cn("mt-1 flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", meta.bg, meta.color)}>
                <div className={cn("size-1.5 rounded-full", meta.bg.replace('/10', ''))} />
                {score >= 80 ? "優異" : score >= 60 ? "良好" : "待加強"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
              <span>完成度</span>
              <span>{clamped.toFixed(0)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${clamped}%` }}
                transition={{ duration: 1, delay: delay + 0.3, ease: "circOut" }}
                className={cn("h-full rounded-full bg-gradient-to-r", meta.bg.replace('/10', ''), meta.bg.replace('/10', '').replace('500', '400'))}
              />
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground/80">{subtitle}</p>

          <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-foreground/5">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="flex flex-col gap-1 transition-colors hover:bg-foreground/5 rounded-xl p-2 -m-2 px-3"
              >
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  {h.label}
                </p>
                <p className="text-sm font-bold tabular-nums text-foreground/90 tracking-tight">
                  {h.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </motion.div>
  );
}
