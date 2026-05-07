import type {
  EngineScoreBreakdown,
  IncomeGenerationLayer,
  Layer3Result,
} from "./types";
import { defaultPolicy, type Policy } from "./policy";

function scoreProfitability(ownerAdjustedNcf: number): number {
  if (ownerAdjustedNcf <= 0) return 10;
  if (ownerAdjustedNcf < 10000) return 40;
  if (ownerAdjustedNcf < 30000) return 60;
  if (ownerAdjustedNcf < 60000) return 75;
  if (ownerAdjustedNcf < 120000) return 88;
  return 95;
}

function scoreStability(volatility6m: number): number {
  const s = (1 - Math.min(1, Math.max(0, volatility6m))) * 100;
  return Math.max(0, Math.min(100, s));
}

export function calcLayer3(
  income: IncomeGenerationLayer,
  policy: Policy = defaultPolicy,
): Layer3Result {
  const { engines } = income;

  if (engines.length === 0) {
    return {
      score: 0,
      incomeDiversificationScore: 0,
      hhi: 1,
      ownerAdjustedIncomeTotal: 0,
      engines: [],
    };
  }

  const totalRevenue = engines.reduce(
    (s, e) => s + e.monthlyRevenueAvg6m,
    0,
  );

  const shares =
    totalRevenue > 0
      ? engines.map((e) => e.monthlyRevenueAvg6m / totalRevenue)
      : engines.map(() => 1 / engines.length);

  const hhi = shares.reduce((s, p) => s + p * p, 0);
  const incomeDiversificationScore = (1 - hhi) * 100;

  const breakdowns = engines.map((e) => {
    const netCashFlow = e.monthlyRevenueAvg6m - e.monthlyCostAvg6m;
    const ownerAdjustedNcf =
      netCashFlow *
      (1 -
        (e.ownerDependencyScore / 100) *
          policy.ownerDependencyAdjustmentFactor);

    const timeLeverageRatio =
      e.monthlyHoursAvg6m > 0 ? netCashFlow / e.monthlyHoursAvg6m : 0;

    const subScoreProfit = scoreProfitability(ownerAdjustedNcf);
    const subScoreStability = scoreStability(e.volatility6m);
    const subScoreScalability = clamp01to100(e.scalabilityScore);
    const subScoreAutomation = clamp01to100(e.automationScore);
    const subScoreMoat = clamp01to100(e.moatScore);

    const score =
      subScoreProfit * 0.3 +
      subScoreStability * 0.2 +
      subScoreScalability * 0.2 +
      subScoreAutomation * 0.15 +
      subScoreMoat * 0.15;

    return {
      engineId: e.id,
      name: e.name,
      netCashFlow,
      ownerAdjustedNcf,
      timeLeverageRatio,
      score,
      weight: 0,
      subScores: {
        profitability: subScoreProfit,
        stability: subScoreStability,
        scalability: subScoreScalability,
        automation: subScoreAutomation,
        moat: subScoreMoat,
      },
    } satisfies EngineScoreBreakdown;
  });

  const totalPositiveOncf = breakdowns.reduce(
    (s, b) => s + Math.max(0, b.ownerAdjustedNcf),
    0,
  );

  if (totalPositiveOncf > 0) {
    for (const b of breakdowns) {
      b.weight = Math.max(0, b.ownerAdjustedNcf) / totalPositiveOncf;
    }
  } else {
    for (const b of breakdowns) {
      b.weight = 1 / breakdowns.length;
    }
  }

  const weightedScore = breakdowns.reduce(
    (s, b) => s + b.score * b.weight,
    0,
  );

  const ownerAdjustedIncomeTotal = breakdowns.reduce(
    (s, b) => s + b.ownerAdjustedNcf,
    0,
  );

  return {
    score: weightedScore,
    incomeDiversificationScore,
    hhi,
    ownerAdjustedIncomeTotal,
    engines: breakdowns,
  };
}

function clamp01to100(n: number): number {
  return Math.max(0, Math.min(100, n));
}
