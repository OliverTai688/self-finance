"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; isUp: boolean };
  className?: string;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-shadow hover:shadow-md",
          "before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_0%_0%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_60%)]",
          className
        )}
      >
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <Icon size={20} />
            </div>
            {trend && (
              <Badge
                variant={trend.isUp ? "success" : "danger"}
                className="rounded-full"
              >
                {trend.isUp ? "+" : ""}
                {trend.value}
              </Badge>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight">{value}</h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
