import type { FinancialProfile, TargetAnalysis } from "./types";
import { defaultPolicy, type Policy } from "./policy";

function tripleRequired(monthlyCost: number, policy: Policy) {
  const annual = Math.max(0, monthlyCost) * 12;
  return {
    aggressive: annual / policy.withdrawalRateAggressive,
    base: annual / policy.withdrawalRateBase,
    conservative: annual / policy.withdrawalRateConservative,
  };
}

function adjustedRequired(
  monthlyCost: number,
  semiPassiveAnnualIncome: number,
  policy: Policy,
) {
  const annualSpend = Math.max(0, monthlyCost) * 12;
  const net = Math.max(0, annualSpend - Math.max(0, semiPassiveAnnualIncome));
  return net / policy.withdrawalRateBase;
}

export function calcTargetAnalysis(
  profile: FinancialProfile,
  currentInvestableAssets: number,
  policy: Policy = defaultPolicy,
): TargetAnalysis {
  const { goals } = profile;

  const single = tripleRequired(goals.targetMonthlyCostSingle, policy);
  const three = tripleRequired(goals.targetMonthlyCostThreePeople, policy);
  const europe = tripleRequired(goals.targetMonthlyCostEurope, policy);

  const adjSingle = adjustedRequired(
    goals.targetMonthlyCostSingle,
    goals.semiPassiveAnnualIncome,
    policy,
  );
  const adjThree = adjustedRequired(
    goals.targetMonthlyCostThreePeople,
    goals.semiPassiveAnnualIncome,
    policy,
  );
  const adjEurope = adjustedRequired(
    goals.targetMonthlyCostEurope,
    goals.semiPassiveAnnualIncome,
    policy,
  );

  return {
    requiredAssetsAggressiveSingle: single.aggressive,
    requiredAssetsBaseSingle: single.base,
    requiredAssetsConservativeSingle: single.conservative,
    requiredAssetsAggressiveThree: three.aggressive,
    requiredAssetsBaseThree: three.base,
    requiredAssetsConservativeThree: three.conservative,
    requiredAssetsAggressiveEurope: europe.aggressive,
    requiredAssetsBaseEurope: europe.base,
    requiredAssetsConservativeEurope: europe.conservative,
    adjustedRequiredAssetsBaseSingle: adjSingle,
    adjustedRequiredAssetsBaseThree: adjThree,
    adjustedRequiredAssetsBaseEurope: adjEurope,
    fundingGapSingle: Math.max(0, single.base - currentInvestableAssets),
    fundingGapThreePeople: Math.max(0, three.base - currentInvestableAssets),
    fundingGapEurope: Math.max(0, europe.base - currentInvestableAssets),
  };
}
