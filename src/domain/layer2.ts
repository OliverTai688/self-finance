import type {
  InvestmentCategory,
  InvestmentLayer,
  Layer2Result,
  LaborIncomeCorrelation,
  RiskTolerance,
} from "./types";
import { defaultPolicy, type Policy } from "./policy";

const RISK_CATEGORIES: readonly InvestmentCategory[] = [
  "equity_etf",
  "single_stock",
  "crypto",
  "business_equity",
];

const LIQUID_CATEGORIES: readonly InvestmentCategory[] = ["cash", "bond"];

export function targetRiskAssetRange(
  riskTolerance: RiskTolerance,
  laborCorrelation: LaborIncomeCorrelation,
): [number, number] {
  if (riskTolerance === "low") {
    return laborCorrelation === "high" ? [0.3, 0.5] : [0.4, 0.6];
  }
  if (riskTolerance === "medium") {
    return laborCorrelation === "high" ? [0.45, 0.65] : [0.55, 0.75];
  }
  return laborCorrelation === "high" ? [0.55, 0.75] : [0.65, 0.85];
}

function scoreLiquidity(lar: number): number {
  if (lar >= 0.15 && lar <= 0.35) return 95;
  if (lar >= 0.1 && lar <= 0.45) return 80;
  if (lar >= 0.05 && lar <= 0.6) return 60;
  return 35;
}

function scoreAllocationFit(
  adjustedRisk: number,
  range: [number, number],
): number {
  const [lo, hi] = range;
  if (adjustedRisk >= lo && adjustedRisk <= hi) return 95;
  const mid = (lo + hi) / 2;
  const halfWidth = (hi - lo) / 2;
  const distance = Math.abs(adjustedRisk - mid);
  const overshoot = distance - halfWidth;
  if (overshoot <= 0.05) return 80;
  if (overshoot <= 0.1) return 60;
  if (overshoot <= 0.2) return 40;
  return 20;
}

function scoreContributionRate(
  ratio: number,
  target: number,
): number {
  if (target <= 0) return 50;
  const r = ratio / target;
  if (r >= 1.25) return 100;
  if (r >= 1) return 95;
  if (r >= 0.75) return 80;
  if (r >= 0.5) return 60;
  if (r >= 0.25) return 40;
  return 20;
}

function scoreRebalancing(
  frequencyMonths: number,
  weights: number[],
  maxSingleTarget: number,
): number {
  let freqScore: number;
  if (frequencyMonths <= 0) freqScore = 30;
  else if (frequencyMonths <= 3) freqScore = 85;
  else if (frequencyMonths <= 6) freqScore = 95;
  else if (frequencyMonths <= 12) freqScore = 85;
  else if (frequencyMonths <= 18) freqScore = 70;
  else freqScore = 45;

  const maxWeight = weights.length > 0 ? Math.max(...weights) : 0;
  const withinTarget = maxWeight <= maxSingleTarget;
  const concentrationPenalty = withinTarget
    ? 0
    : Math.min(40, (maxWeight - maxSingleTarget) * 150);

  return Math.max(0, freqScore - concentrationPenalty);
}

export function calcLayer2(
  investment: InvestmentLayer,
  annualGrossIncome: number,
  policy: Policy = defaultPolicy,
): Layer2Result {
  const { items } = investment;
  const total = items.reduce((sum, i) => sum + i.marketValue, 0);

  const weights = total > 0 ? items.map((i) => i.marketValue / total) : [];
  const hhi = weights.reduce((sum, w) => sum + w * w, 0);
  const diversificationScore = items.length === 0 ? 0 : (1 - hhi) * 100;

  const liquidValue = items
    .filter(
      (i) =>
        LIQUID_CATEGORIES.includes(i.category) || i.liquidityLevel >= 4,
    )
    .reduce((sum, i) => sum + i.marketValue, 0);
  const liquidAssetRatio = total > 0 ? liquidValue / total : 0;

  const riskValue = items
    .filter((i) => RISK_CATEGORIES.includes(i.category))
    .reduce((sum, i) => sum + i.marketValue, 0);
  const riskAssetRatio = total > 0 ? riskValue / total : 0;

  const hca =
    policy.humanCapitalAdjustment[investment.laborIncomeCorrelationToMarket];
  const riskAssetRatioAdjusted = riskAssetRatio / hca;

  const range = targetRiskAssetRange(
    investment.riskTolerance,
    investment.laborIncomeCorrelationToMarket,
  );

  const annualContributions = items.reduce(
    (sum, i) => sum + i.monthlyContribution * 12,
    0,
  );
  const investmentContributionRatio =
    annualGrossIncome > 0 ? annualContributions / annualGrossIncome : 0;

  const subScoreDiversification = diversificationScore;
  const subScoreAllocation = scoreAllocationFit(
    riskAssetRatioAdjusted,
    range,
  );
  const subScoreLiquidity = scoreLiquidity(liquidAssetRatio);
  const subScoreContribution = scoreContributionRate(
    investmentContributionRatio,
    policy.targetInvestmentContributionRatio,
  );
  const subScoreRebalancing = scoreRebalancing(
    investment.rebalancingFrequencyMonths,
    weights,
    investment.maxSinglePositionRatioTarget || policy.maxSinglePositionRatioTarget,
  );

  const score =
    subScoreDiversification * 0.3 +
    subScoreAllocation * 0.2 +
    subScoreLiquidity * 0.2 +
    subScoreContribution * 0.15 +
    subScoreRebalancing * 0.15;

  return {
    score,
    hhi,
    diversificationScore,
    liquidAssetRatio,
    riskAssetRatio,
    riskAssetRatioAdjusted,
    humanCapitalAdjustment: hca,
    targetRiskAssetRange: range,
    allocationFitScore: subScoreAllocation,
    investmentContributionRatio,
    rebalancingDisciplineScore: subScoreRebalancing,
    subScores: {
      diversification: subScoreDiversification,
      allocationFit: subScoreAllocation,
      liquidity: subScoreLiquidity,
      contributionRate: subScoreContribution,
      rebalancing: subScoreRebalancing,
    },
  };
}
