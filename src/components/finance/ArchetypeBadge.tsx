import { Badge } from "@/components/ui/badge";
import type { ArchetypeLabel } from "@/domain/types";
import { ShieldCheck, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const META: Record<
  ArchetypeLabel,
  { label: string; icon: any; className: string }
> = {
  defense_weak: { 
    label: "防禦不足型", 
    icon: ShieldAlert, 
    className: "bg-rose-500/10 text-rose-500 border-rose-500/20" 
  },
  investment_imbalanced: { 
    label: "投資失衡型", 
    icon: AlertTriangle, 
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20" 
  },
  engine_immature: { 
    label: "引擎未成熟型", 
    icon: Zap, 
    className: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" 
  },
  balanced: { 
    label: "三層平衡型", 
    icon: CheckCircle2, 
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
  },
};

import { ShieldAlert } from "lucide-react";

export default function ArchetypeBadge({ archetype }: { archetype: ArchetypeLabel }) {
  const meta = META[archetype];
  const Icon = meta.icon;
  
  return (
    <Badge 
      variant="outline" 
      className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide transition-all shadow-sm border", meta.className)}
    >
      <Icon size={12} strokeWidth={2.5} />
      {meta.label}
    </Badge>
  );
}
