"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/layout/PageHeader";
import ScoreDial from "@/components/finance/ScoreDial";
import LayerScoreCard from "@/components/finance/LayerScoreCard";
import RecommendationList from "@/components/finance/RecommendationList";
import TargetGapChart from "@/components/finance/TargetGapChart";
import ArchetypeBadge from "@/components/finance/ArchetypeBadge";
import EmptyProfileCard from "@/components/finance/EmptyProfileCard";
import { useActiveProfile } from "@/hooks/use-active-profile";
import { useEvaluation } from "@/hooks/use-evaluation";
import { formatMoney, formatPercent } from "@/lib/money";
import { motion } from "motion/react";
import { Wallet, ShieldAlert, Sparkles, PieChart, Activity, Rocket } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Home() {
  const { profile, isDemo, loading } = useActiveProfile();
  const evaluation = useEvaluation(profile);

  if (loading) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center blur-sm absolute" />
          <Wallet className="size-12 text-primary relative z-10" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
            分析資產中...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!profile || !evaluation) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto py-12">
        <PageHeader
          title="三層財務系統"
          description="輸入你的財務資料，自動評估防禦、配置與收入引擎，打造穩健的資產組合。"
        />
        <EmptyProfileCard />
      </div>
    );
  }

  const currency = profile.profile.currency;
  const totalAssets = profile.investment.items.reduce(
    (s, i) => s + i.marketValue,
    0,
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-20"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title={`Hi${profile.profile.name ? `, ${profile.profile.name}` : ""}`}
          description="我們已為您完成三層財務健康度的即時計算，以下是您的財務現況分析。"
        />
        
        {isDemo && (
          <motion.div 
            variants={item}
            className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 backdrop-blur-md"
          >
            <Sparkles size={14} className="animate-pulse" />
            目前為 Demo 預覽模式
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Hero Card: Overall Score */}
        <motion.div variants={item} className="lg:col-span-1">
          <div className="relative group h-full flex flex-col items-center justify-center rounded-[2.5rem] glass-card p-10 overflow-hidden border-white/20">
            <div className="absolute inset-0 bg-gradient-premium opacity-[0.03] transition-opacity group-hover:opacity-[0.05]" />
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-[80px]" />
            <div className="absolute -left-20 -bottom-20 size-64 rounded-full bg-secondary/10 blur-[80px]" />
            
            <div className="relative z-10 space-y-8 flex flex-col items-center w-full">
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-foreground/5 px-4 py-1 flex items-center gap-2">
                  <Activity size={12} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">健康指數</span>
                </div>
                <h3 className="text-2xl font-black tracking-tighter">總體財務評分</h3>
              </div>
              
              <ScoreDial value={evaluation.scores.total} size={240} thickness={14} />
              
              <div className="flex flex-col items-center gap-4 w-full">
                <ArchetypeBadge archetype={evaluation.archetype} />
                
                <div className="grid w-full grid-cols-3 gap-4 pt-6 border-t border-foreground/5">
                  <Stat label="總資產" value={formatMoney(totalAssets, currency)} />
                  <Stat label="緊急金" value={`${evaluation.layer1.emergencyFundMonths.toFixed(1)} 月`} />
                  <Stat label="分散性" value={evaluation.layer3.incomeDiversificationScore.toFixed(0)} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Layer Breakdown Section */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={item} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <PieChart size={18} />
              </div>
              <h3 className="text-xl font-black tracking-tight">三層資產分析</h3>
            </div>
            <Badge variant="outline" className="rounded-full h-7 px-3 text-[10px] font-bold uppercase tracking-widest bg-foreground/5 border-none">
              評估層級: 03
            </Badge>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <LayerScoreCard
              layer={1}
              score={evaluation.scores.layer1Defense}
              title="個人財務防禦"
              subtitle="防禦金、保險與債務比的平衡狀態。"
              highlights={[
                {
                  label: "緊急金月數",
                  value: `${evaluation.layer1.emergencyFundMonths.toFixed(1)} / ${evaluation.layer1.emergencyFundTargetMonths.toFixed(0)}`,
                },
                {
                  label: "覆蓋率",
                  value: `${evaluation.layer1.coverageRatio.toFixed(2)}×`,
                },
              ]}
              delay={0.1}
            />
            <LayerScoreCard
              layer={2}
              score={evaluation.scores.layer2Investment}
              title="長期投資配置"
              subtitle="風險資產的分散度與投入效率。"
              highlights={[
                {
                  label: "風險資產比",
                  value: formatPercent(evaluation.layer2.riskAssetRatioAdjusted),
                },
                {
                  label: "分散指標",
                  value: evaluation.layer2.diversificationScore.toFixed(0),
                },
              ]}
              delay={0.2}
            />
            <LayerScoreCard
              layer={3}
              score={evaluation.scores.layer3IncomeGeneration}
              title="現實收入生成"
              subtitle="多元收入引擎的穩定性與槓桿能力。"
              highlights={[
                {
                  label: "引擎數量",
                  value: `${profile.incomeGeneration.engines.length} 個`,
                },
                {
                  label: "月淨流 (OA)",
                  value: formatMoney(evaluation.layer3.ownerAdjustedIncomeTotal, currency),
                },
              ]}
              delay={0.3}
            />
          </div>
          
          <motion.div variants={item} className="mt-8">
            <TargetGapChart
              targets={evaluation.targets}
              currentInvestableAssets={totalAssets}
              currency={currency}
            />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        {/* Recommendation Section */}
        <motion.div variants={item} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ShieldAlert size={18} />
            </div>
            <h3 className="text-xl font-black tracking-tight">智能優化建議</h3>
          </div>
          <RecommendationList recommendations={evaluation.recommendations} />
        </motion.div>

        {/* Engine Breakdown Detailed Section */}
        <motion.div variants={item} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
              <Rocket size={18} />
            </div>
            <h3 className="text-xl font-black tracking-tight">收入引擎細節</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {evaluation.layer3.engines.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-foreground/10 p-10 text-center">
                <p className="text-sm font-medium text-muted-foreground/60">
                  尚無偵測到有效的收入引擎
                </p>
              </div>
            ) : (
              evaluation.layer3.engines.map((e) => (
                <div
                  key={e.engineId}
                  className="group relative overflow-hidden rounded-3xl border border-white/5 bg-foreground/[0.02] p-5 transition-all duration-300 hover:bg-foreground/[0.04] hover:border-primary/20 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black tracking-tight text-foreground/90">{e.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="h-5 rounded-full border-none bg-primary/10 text-[9px] font-bold text-primary px-2">
                          權重 {(e.weight * 100).toFixed(0)}%
                        </Badge>
                        <span className="text-[10px] font-medium text-muted-foreground/50">ID: {e.engineId.slice(0, 4)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black tracking-tighter text-foreground">{e.score.toFixed(0)}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">SCORE</p>
                    </div>
                  </div>
                  
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/5 p-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">OA 淨流</p>
                      <p className="mt-0.5 text-xs font-bold tabular-nums">{formatMoney(e.ownerAdjustedNcf, currency)}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">時間槓桿</p>
                      <p className="mt-0.5 text-xs font-bold tabular-nums">{formatMoney(e.timeLeverageRatio, currency)}/h</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
        {label}
      </p>
      <p className="text-sm font-black tabular-nums text-foreground/80 tracking-tight">{value}</p>
    </div>
  );
}
