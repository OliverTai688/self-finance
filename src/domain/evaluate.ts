import type { EvaluationResult, FinancialProfile } from "./types";
import { defaultPolicy, type Policy } from "./policy";
import { calcLayer1 } from "./layer1";
import { calcLayer2 } from "./layer2";
import { calcLayer3 } from "./layer3";
import { calcTargetAnalysis } from "./targets";
import { buildEvaluationWithRecommendations } from "./recommend";

export function evaluateFinancialArchitecture(
  profile: FinancialProfile,
  policy: Policy = defaultPolicy,
): EvaluationResult {
  const annualGrossIncome =
    (profile.personalFinance.monthlyIncomeFixed +
      profile.personalFinance.monthlyIncomeVariableAvg12m) *
    12;

  const layer1 = calcLayer1(
    profile.personalFinance,
    profile.profile.dependentsCount,
    policy,
  );

  const layer2 = calcLayer2(profile.investment, annualGrossIncome, policy);

  const layer3 = calcLayer3(profile.incomeGeneration, policy);

  const totalInvestableAssets = profile.investment.items.reduce(
    (s, i) => s + i.marketValue,
    0,
  );

  const targets = calcTargetAnalysis(profile, totalInvestableAssets, policy);

  const total =
    layer1.score * policy.layerWeights.l1 +
    layer2.score * policy.layerWeights.l2 +
    layer3.score * policy.layerWeights.l3;

  const base: Omit<EvaluationResult, "recommendations" | "archetype"> = {
    scores: {
      layer1Defense: layer1.score,
      layer2Investment: layer2.score,
      layer3IncomeGeneration: layer3.score,
      total,
    },
    layer1,
    layer2,
    layer3,
    targets,
  };

  return buildEvaluationWithRecommendations(profile, base, policy);
}
