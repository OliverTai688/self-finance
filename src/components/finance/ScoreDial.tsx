"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ScoreDialProps {
  value: number;
  label?: string;
  size?: number;
  thickness?: number;
  className?: string;
}

function scoreColors(value: number): [string, string] {
  if (value >= 80) return ["oklch(0.65 0.25 160)", "oklch(0.55 0.2 160)"]; // Emerald
  if (value >= 60) return ["oklch(0.6 0.22 260)", "oklch(0.5 0.2 260)"]; // Indigo
  if (value >= 40) return ["oklch(0.7 0.2 300)", "oklch(0.6 0.18 300)"]; // Violet
  return ["oklch(0.6 0.25 25)", "oklch(0.5 0.2 25)"]; // Red
}

function scoreLabel(value: number): string {
  if (value >= 80) return "傑出";
  if (value >= 60) return "穩定";
  if (value >= 40) return "警示";
  return "高風險";
}

export default function ScoreDial({
  value,
  label,
  size = 200,
  thickness = 12,
  className,
}: ScoreDialProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - thickness * 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);
  const colors = scoreColors(clamped);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* Decorative Outer Ring */}
      <div 
        className="absolute inset-0 rounded-full border border-foreground/5 bg-foreground/[0.02]"
        style={{ margin: thickness }}
      />
      
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={thickness}
          fill="none"
          className="text-foreground/[0.05]"
        />

        {/* Outer Dot Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + thickness + 4}
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeDasharray="1 6"
          className="text-foreground/10"
        />

        {/* Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#score-gradient)"
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          filter="url(#glow)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center"
        >
          <span className="text-5xl font-black tabular-nums tracking-tighter text-foreground drop-shadow-sm leading-none">
            {clamped.toFixed(0)}
          </span>
          <div className="mt-2 flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 leading-none">
              Overall Score
            </span>
            <div className={cn("mt-1 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide transition-all shadow-sm", 
              clamped >= 80 ? "bg-emerald-500/10 text-emerald-500" :
              clamped >= 60 ? "bg-indigo-500/10 text-indigo-500" :
              clamped >= 40 ? "bg-violet-500/10 text-violet-500" :
              "bg-rose-500/10 text-rose-500"
            )}>
              {label ?? scoreLabel(clamped)}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
