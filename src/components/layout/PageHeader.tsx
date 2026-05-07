"use client";

import DemoModeToggle from "@/components/finance/DemoModeToggle";
import { motion } from "motion/react";

interface Props {
  title: string;
  description?: string;
  right?: React.ReactNode;
}

export default function PageHeader({ title, description, right }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-2"
    >
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tighter sm:text-5xl lg:text-6xl">
          <span className="text-gradient drop-shadow-sm">{title}</span>
        </h1>
        {description && (
          <p className="max-w-2xl text-sm font-medium text-muted-foreground/80 md:text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4 pb-1">
        <div className="rounded-2xl border border-foreground/5 bg-foreground/[0.02] p-1 shadow-sm backdrop-blur-sm">
          <DemoModeToggle />
        </div>
        {right}
      </div>
    </motion.div>
  );
}
