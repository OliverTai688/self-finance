"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PageHeader from "@/components/layout/PageHeader";
import EmptyProfileCard from "@/components/finance/EmptyProfileCard";
import TargetGapChart from "@/components/finance/TargetGapChart";
import ArchetypeBadge from "@/components/finance/ArchetypeBadge";
import RecommendationList from "@/components/finance/RecommendationList";
import { useActiveProfile } from "@/hooks/use-active-profile";
import { useEvaluation } from "@/hooks/use-evaluation";
import { formatMoney, formatPercent } from "@/lib/money";

export default function ReportPage() {
  const { profile, loading } = useActiveProfile();
  const evaluation = useEvaluation(profile);

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader title="詳細報告" description="載入中…" />
      </div>
    );
  }

  if (!profile || !evaluation) {
    return (
      <div className="space-y-8">
        <PageHeader title="詳細報告" />
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
    <div className="space-y-8">
      <PageHeader
        title="詳細報告"
        description="每一個指標的明細與子分數"
        right={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft size={14} /> 回 Dashboard
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>總覽</CardTitle>
            <CardDescription>
              總分 {evaluation.scores.total.toFixed(1)} · 原型判斷
            </CardDescription>
          </div>
          <ArchetypeBadge archetype={evaluation.archetype} />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat
            label="L1 防禦"
            value={evaluation.scores.layer1Defense.toFixed(0)}
          />
          <Stat
            label="L2 投資"
            value={evaluation.scores.layer2Investment.toFixed(0)}
          />
          <Stat
            label="L3 收入"
            value={evaluation.scores.layer3IncomeGeneration.toFixed(0)}
          />
          <Stat label="總分" value={evaluation.scores.total.toFixed(0)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layer 1 · 防禦層明細</CardTitle>
          <CardDescription>
            綜合：0.35 EFM + 0.25 覆蓋率 + 0.15 債務 + 0.10 保險 + 0.15 收入穩定
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <SubScoreRow
            label="緊急備援月數"
            score={evaluation.layer1.subScores.emergencyFund}
            detail={`${evaluation.layer1.emergencyFundMonths.toFixed(1)} / ${evaluation.layer1.emergencyFundTargetMonths.toFixed(0)} 月（DCF ${evaluation.layer1.dependentsCoefficient.toFixed(2)}）`}
          />
          <SubScoreRow
            label="必要支出覆蓋率（變動 ×0.7）"
            score={evaluation.layer1.subScores.coverage}
            detail={`${evaluation.layer1.coverageRatio.toFixed(2)}×`}
          />
          <SubScoreRow
            label="債務服務比"
            score={evaluation.layer1.subScores.debt}
            detail={formatPercent(evaluation.layer1.debtServiceRatio)}
          />
          <SubScoreRow
            label="保險覆蓋"
            score={evaluation.layer1.subScores.insurance}
            detail={`${evaluation.layer1.subScores.insurance.toFixed(0)} / 100`}
          />
          <SubScoreRow
            label="收入穩定度"
            score={evaluation.layer1.subScores.incomeStability}
            detail={formatPercent(evaluation.layer1.incomeStabilityRatio)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layer 2 · 投資配置明細</CardTitle>
          <CardDescription>
            綜合：0.30 分散 + 0.20 配置帶 + 0.20 流動性 + 0.15 投入率 + 0.15 再平衡
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SubScoreRow
              label="分散度 (1 − HHI)"
              score={evaluation.layer2.subScores.diversification}
              detail={`HHI ${evaluation.layer2.hhi.toFixed(3)}`}
            />
            <SubScoreRow
              label="配置帶吻合度"
              score={evaluation.layer2.subScores.allocationFit}
              detail={`修正後 ${formatPercent(
                evaluation.layer2.riskAssetRatioAdjusted,
              )}，目標 ${(evaluation.layer2.targetRiskAssetRange[0] * 100).toFixed(
                0,
              )}–${(evaluation.layer2.targetRiskAssetRange[1] * 100).toFixed(0)}%`}
            />
            <SubScoreRow
              label="流動性"
              score={evaluation.layer2.subScores.liquidity}
              detail={formatPercent(evaluation.layer2.liquidAssetRatio)}
            />
            <SubScoreRow
              label="投資覆蓋速度"
              score={evaluation.layer2.subScores.contributionRate}
              detail={formatPercent(
                evaluation.layer2.investmentContributionRatio,
              )}
            />
            <SubScoreRow
              label="再平衡紀律"
              score={evaluation.layer2.subScores.rebalancing}
              detail="含單一部位集中懲罰"
            />
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-4 text-xs">
            <p className="font-semibold">人力資本修正 (HCA)</p>
            <p className="mt-1 text-muted-foreground">
              你的勞動收入與市場相關性為
              <Badge variant="outline" className="mx-1 rounded-md">
                {profile.investment.laborIncomeCorrelationToMarket}
              </Badge>
              ，HCA = {evaluation.layer2.humanCapitalAdjustment.toFixed(2)}；名目風險資產
              {formatPercent(evaluation.layer2.riskAssetRatio)} → 修正後
              {formatPercent(evaluation.layer2.riskAssetRatioAdjusted)}。
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layer 3 · 引擎拆解</CardTitle>
          <CardDescription>
            引擎分數 = 0.30 利潤 + 0.20 穩定 + 0.20 可擴張 + 0.15 自動化 + 0.15 護城河；以 OA 淨流加權
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {evaluation.layer3.engines.map((e) => (
            <div
              key={e.engineId}
              className="rounded-xl border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{e.name}</p>
                <Badge variant="outline" className="rounded-md">
                  權重 {(e.weight * 100).toFixed(0)}% · 分數 {e.score.toFixed(0)}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-5">
                <Stat label="淨現金流" value={formatMoney(e.netCashFlow, currency)} />
                <Stat label="OA 淨流" value={formatMoney(e.ownerAdjustedNcf, currency)} />
                <Stat
                  label="時間槓桿"
                  value={`${formatMoney(e.timeLeverageRatio, currency)}/h`}
                />
                <Stat label="利潤" value={e.subScores.profitability.toFixed(0)} />
                <Stat label="穩定" value={e.subScores.stability.toFixed(0)} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <TargetGapChart
        targets={evaluation.targets}
        currentInvestableAssets={totalAssets}
        currency={currency}
      />

      <Card>
        <CardHeader>
          <CardTitle>三段提領率對照</CardTitle>
          <CardDescription>
            同一月生活費下，不同提領率所需資產
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <WithdrawalRow
            label="一人生活"
            currency={currency}
            aggressive={evaluation.targets.requiredAssetsAggressiveSingle}
            base={evaluation.targets.requiredAssetsBaseSingle}
            conservative={evaluation.targets.requiredAssetsConservativeSingle}
            adjustedBase={evaluation.targets.adjustedRequiredAssetsBaseSingle}
          />
          <WithdrawalRow
            label="三人生活"
            currency={currency}
            aggressive={evaluation.targets.requiredAssetsAggressiveThree}
            base={evaluation.targets.requiredAssetsBaseThree}
            conservative={evaluation.targets.requiredAssetsConservativeThree}
            adjustedBase={evaluation.targets.adjustedRequiredAssetsBaseThree}
          />
          <WithdrawalRow
            label="歐洲模式"
            currency={currency}
            aggressive={evaluation.targets.requiredAssetsAggressiveEurope}
            base={evaluation.targets.requiredAssetsBaseEurope}
            conservative={evaluation.targets.requiredAssetsConservativeEurope}
            adjustedBase={evaluation.targets.adjustedRequiredAssetsBaseEurope}
          />
          <p className="text-xs text-muted-foreground">
            調整後基準 = (年支出 − 年半被動收入) / 3.7%
          </p>
        </CardContent>
      </Card>

      <RecommendationList recommendations={evaluation.recommendations} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function SubScoreRow({
  label,
  score,
  detail,
}: {
  label: string;
  score: number;
  detail: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums font-semibold">
          {score.toFixed(0)}
        </span>
      </div>
      <Progress value={Math.max(0, Math.min(100, score))} />
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function WithdrawalRow({
  label,
  currency,
  aggressive,
  base,
  conservative,
  adjustedBase,
}: {
  label: string;
  currency: "TWD" | "USD";
  aggressive: number;
  base: number;
  conservative: number;
  adjustedBase: number;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-sm font-semibold">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
        <Stat label="進取 4%" value={formatMoney(aggressive, currency)} />
        <Stat label="基準 3.7%" value={formatMoney(base, currency)} />
        <Stat
          label="保守 3.5%"
          value={formatMoney(conservative, currency)}
        />
        <Stat
          label="調整後基準"
          value={formatMoney(adjustedBase, currency)}
        />
      </div>
    </div>
  );
}
