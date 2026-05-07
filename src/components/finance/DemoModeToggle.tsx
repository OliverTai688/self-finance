"use client";

import { Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export default function DemoModeToggle({ className }: Props) {
  const { demoMode, setDemoMode, hydrated } = useDemoMode();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 transition-colors",
        demoMode && "border-primary/40 bg-primary/5 text-primary",
        className,
      )}
    >
      <Sparkles size={14} />
      <label
        htmlFor="demo-mode-switch"
        className="select-none text-xs font-medium uppercase tracking-wider cursor-pointer"
      >
        Demo 資料
      </label>
      <Switch
        id="demo-mode-switch"
        checked={demoMode}
        disabled={!hydrated}
        onCheckedChange={setDemoMode}
      />
    </div>
  );
}
