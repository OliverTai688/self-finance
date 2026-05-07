"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  PieChart,
  Wallet,
  Settings,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: ListChecks, label: "資料輸入", href: "/inputs" },
  { icon: PieChart, label: "詳細報告", href: "/report" },
  { icon: BookOpen, label: "名詞解釋", href: "/glossary" },
  { icon: Settings, label: "設定", href: "/settings" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-4 top-4 z-50 flex h-[calc(100vh-32px)] w-64 flex-col gap-8 rounded-3xl border border-white/10 glass-card p-6 transition-all duration-500 hover:border-primary/20">
      <Link href="/" className="flex items-center gap-3 px-2 group">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-premium shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 glow-box">
          <Wallet className="text-white" size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-foreground">Self Finance</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">Asset System</span>
        </div>
      </Link>

      <Separator className="bg-foreground/5" />

      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
                active
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              {active && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 z-0 rounded-2xl bg-gradient-premium shadow-lg shadow-primary/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon
                size={20}
                className={cn(
                  "relative z-10 transition-transform duration-300 group-hover:scale-110",
                  active ? "text-primary-foreground" : "group-hover:text-primary",
                )}
              />
              <span className="relative z-10">{item.label}</span>
              {active && (
                <ArrowRight size={14} className="relative z-10 ml-auto opacity-70" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto">
        <div className="group relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 to-secondary/5 p-5 transition-all duration-300 hover:border-primary/30">
          <div className="absolute -right-4 -top-4 size-24 rounded-full bg-primary/10 blur-2xl transition-all duration-500 group-hover:scale-150" />
          
          <p className="relative z-10 text-[11px] font-bold uppercase tracking-widest text-primary/80">
            三層財務系統
          </p>
          <p className="relative z-10 mt-2 text-xs leading-relaxed text-muted-foreground/80">
            防禦・配置・收入引擎<br />全方位健康度評估。
          </p>
          
          <Button 
            className="relative z-10 mt-5 w-full rounded-xl bg-foreground text-background transition-all duration-300 hover:scale-[1.02] hover:bg-foreground/90 active:scale-[0.98]" 
            size="sm" 
            asChild
          >
            <Link href="/inputs" className="flex items-center gap-2">
              立即更新資料
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
