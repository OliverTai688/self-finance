import type {
  ArchetypeLabel,
  EvaluationResult,
  FinancialProfile,
  Recommendation,
} from "./types";
import { defaultPolicy, type Policy } from "./policy";

interface RecommendationContext {
  profile: FinancialProfile;
  evaluation: Omit<EvaluationResult, "recommendations" | "archetype">;
  policy: Policy;
}

export function deriveArchetype(
  ctx: RecommendationContext,
): ArchetypeLabel {
  const { scores } = ctx.evaluation;
  const l1 = scores.layer1Defense;
  const l2 = scores.layer2Investment;
  const l3 = scores.layer3IncomeGeneration;

  const min = Math.min(l1, l2, l3);
  const gap = Math.max(l1, l2, l3) - min;

  if (gap < 10) return "balanced";
  if (min === l1) return "defense_weak";
  if (min === l2) return "investment_imbalanced";
  return "engine_immature";
}

export function generateRecommendations(
  profile: FinancialProfile,
  evaluation: Omit<EvaluationResult, "recommendations" | "archetype">,
  policy: Policy = defaultPolicy,
): Recommendation[] {
  const ctx: RecommendationContext = { profile, evaluation, policy };
  const out: Recommendation[] = [];

  const { layer1, layer2, layer3 } = evaluation;
  const pf = profile.personalFinance;
  const totalIncome =
    pf.monthlyIncomeFixed + pf.monthlyIncomeVariableAvg12m;

  if (layer1.emergencyFundMonths < 6) {
    out.push({
      id: "rule-1-emergency-fund",
      priority: 1,
      layer: 1,
      title: "緊急金未達 6 個月，優先補足第一層",
      detail: `目前約 ${layer1.emergencyFundMonths.toFixed(
        1,
      )} 個月，建議將新增可支配現金的 60% 先補緊急金；目標約 ${layer1.emergencyFundTargetMonths.toFixed(
        1,
      )} 個月。`,
      suggestedCashAllocationPct: 60,
    });
  }

  if (
    pf.highInterestDebtBalance > 0 &&
    pf.highInterestDebtRate > policy.expectedLongTermReturnAnnual
  ) {
    out.push({
      id: "rule-2-high-interest-debt",
      priority: 1,
      layer: 1,
      title: "高利負債利率高於長期報酬預期，優先還債",
      detail: `負債利率 ${(pf.highInterestDebtRate * 100).toFixed(
        1,
      )}% 高於長期投資預期報酬 ${(
        policy.expectedLongTermReturnAnnual * 100
      ).toFixed(1)}%。加碼風險資產的數學期望為負，優先清償。`,
    });
  }

  const salaryEngine = profile.incomeGeneration.engines.find(
    (e) => e.type === "salary",
  );
  const totalEngineRevenue = profile.incomeGeneration.engines.reduce(
    (s, e) => s + e.monthlyRevenueAvg6m,
    0,
  );
  const salaryShare =
    salaryEngine && totalEngineRevenue > 0
      ? salaryEngine.monthlyRevenueAvg6m / totalEngineRevenue
      : 0;

  if (
    salaryShare > 0.7 &&
    profile.incomeGeneration.entrepreneurshipIntent
  ) {
    out.push({
      id: "rule-3-single-employer",
      priority: 2,
      layer: 3,
      title: "收入 70% 以上來自單一雇主，建議啟動第二引擎",
      detail:
        "在你明確表達創業意圖的前提下，補足第一層後應優先建立第三層第二收入引擎，之後才放大第二層投資。",
    });
  }

  const matureEngine = layer3.engines.find((e) => {
    const src = profile.incomeGeneration.engines.find(
      (s) => s.id === e.engineId,
    );
    return (
      src &&
      src.sixMonthPositiveNcf &&
      src.ownerDependencyTrend === "falling" &&
      e.ownerAdjustedNcf > 0
    );
  });

  if (matureEngine) {
    out.push({
      id: "rule-4-mature-engine",
      priority: 2,
      layer: 3,
      title: `引擎「${matureEngine.name}」已成熟，可提高再投資權重`,
      detail:
        "此引擎連續 6 個月淨現金流為正、擁有者依賴下降中。可將其淨利的一部分回流至自動化、行銷或商品化，放大槓桿。",
    });
  }

  if (
    layer2.riskAssetRatioAdjusted <
      layer2.targetRiskAssetRange[0] &&
    layer1.score >= 70
  ) {
    out.push({
      id: "l2-under-range",
      priority: 3,
      layer: 2,
      title: "修正後風險資產比低於目標帶，可提高成長資產",
      detail: `目前 ${(layer2.riskAssetRatioAdjusted * 100).toFixed(
        1,
      )}%（已做人力資本修正），目標帶 ${(
        layer2.targetRiskAssetRange[0] * 100
      ).toFixed(0)}%–${(layer2.targetRiskAssetRange[1] * 100).toFixed(
        0,
      )}%。第一層穩固時可逐步加碼 ETF。`,
    });
  }

  if (
    layer2.riskAssetRatioAdjusted >
    layer2.targetRiskAssetRange[1]
  ) {
    out.push({
      id: "l2-over-range",
      priority: 2,
      layer: 2,
      title: "修正後風險資產比超過目標帶，考慮再平衡",
      detail: `目前 ${(layer2.riskAssetRatioAdjusted * 100).toFixed(
        1,
      )}% 高於上限 ${(
        layer2.targetRiskAssetRange[1] * 100
      ).toFixed(0)}%。你的職涯收入與科技市場相關性提高了總曝險，建議分批再平衡。`,
    });
  }

  if (
    layer2.investmentContributionRatio <
      policy.targetInvestmentContributionRatio &&
    layer1.score >= 60
  ) {
    const pctGap =
      (policy.targetInvestmentContributionRatio -
        layer2.investmentContributionRatio) *
      100;
    out.push({
      id: "l2-contribution",
      priority: 3,
      layer: 2,
      title: "投資覆蓋速度低於建議值",
      detail: `目前年投資佔總收入 ${(
        layer2.investmentContributionRatio * 100
      ).toFixed(1)}%，建議拉到 ${(
        policy.targetInvestmentContributionRatio * 100
      ).toFixed(0)}% 以維持資產累積速度，缺口約 ${pctGap.toFixed(1)} 個百分點。`,
    });
  }

  const enginesCount = profile.incomeGeneration.engines.length;
  if (
    enginesCount < policy.targetIncomeEngineCount &&
    layer1.score >= 60
  ) {
    out.push({
      id: "l3-add-engine",
      priority: 3,
      layer: 3,
      title: `收入引擎不足（${enginesCount}/${policy.targetIncomeEngineCount}）`,
      detail:
        "多引擎能降低單點斷裂風險，建議規劃下一個適合你能力的收入形態（顧問、內容、SaaS、教學等）。",
    });
  }

  if (totalIncome > 0 && layer1.incomeStabilityRatio < 0.5) {
    out.push({
      id: "l1-stability",
      priority: 3,
      layer: 1,
      title: "固定收入占比偏低",
      detail:
        "變動收入超過一半，系統對其已打七折計算覆蓋率。若要降低波動風險，可考慮穩定化核心接案或轉為固定顧問合約。",
    });
  }

  return out
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 8);
}

export function buildEvaluationWithRecommendations(
  profile: FinancialProfile,
  base: Omit<EvaluationResult, "recommendations" | "archetype">,
  policy: Policy = defaultPolicy,
): EvaluationResult {
  const archetype = deriveArchetype({ profile, evaluation: base, policy });
  const recommendations = generateRecommendations(profile, base, policy);
  return { ...base, archetype, recommendations };
}
