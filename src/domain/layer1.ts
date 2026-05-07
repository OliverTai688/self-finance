import type { Layer1Result, PersonalFinanceLayer } from "./types";
import { defaultPolicy, type Policy } from "./policy";

function scoreEmergencyFund(months: number, targetMonths: number): number {
  const ratio = targetMonths > 0 ? months / targetMonths : 0;
  if (ratio < 3 / 9) return 25;
  if (ratio < 6 / 9) return 60;
  if (ratio < 1) return 85;
  return 100;
}

function scoreCoverageRatio(coverage: number): number {
  if (coverage < 1) return 30;
  if (coverage < 1.5) return 60;
  if (coverage < 2) return 80;
  return 95;
}

function scoreDebtServiceRatio(dsr: number): number {
  if (dsr > 0.35) return 20;
  if (dsr > 0.2) return 50;
  if (dsr > 0.1) return 75;
  return 95;
}

export function calcLayer1(
  pf: PersonalFinanceLayer,
  dependentsCount: number,
  policy: Policy = defaultPolicy,
): Layer1Result {
  const totalIncome =
    pf.monthlyIncomeFixed + pf.monthlyIncomeVariableAvg12m;

  const emergencyFundMonths =
    pf.monthlyEssentialExpense > 0
      ? pf.emergencyFundCash / pf.monthlyEssentialExpense
      : 0;

  const dependentsCoefficient =
    1 + policy.dependentsCoefficientSlope * dependentsCount;

  const emergencyFundTargetMonths =
    policy.emergencyFundBaseTargetMonths * dependentsCoefficient;

  const coverageRatio =
    pf.monthlyEssentialExpense > 0
      ? (pf.monthlyIncomeFixed +
          pf.monthlyIncomeVariableAvg12m * policy.variableIncomeDiscount) /
        pf.monthlyEssentialExpense
      : 0;

  const debtServiceRatio =
    totalIncome > 0 ? pf.debtMonthlyPayment / totalIncome : 0;

  const incomeStabilityRatio =
    totalIncome > 0 ? pf.monthlyIncomeFixed / totalIncome : 0;

  const subScoreEF = scoreEmergencyFund(
    emergencyFundMonths,
    emergencyFundTargetMonths,
  );
  const subScoreCoverage = scoreCoverageRatio(coverageRatio);
  const subScoreDebt = scoreDebtServiceRatio(debtServiceRatio);
  const subScoreInsurance = clamp(pf.insuranceCoverageScore, 0, 100);
  const subScoreStability = incomeStabilityRatio * 100;

  const score =
    subScoreEF * 0.35 +
    subScoreCoverage * 0.25 +
    subScoreDebt * 0.15 +
    subScoreInsurance * 0.1 +
    subScoreStability * 0.15;

  return {
    score,
    emergencyFundMonths,
    emergencyFundTargetMonths,
    coverageRatio,
    debtServiceRatio,
    dependentsCoefficient,
    incomeStabilityRatio,
    subScores: {
      emergencyFund: subScoreEF,
      coverage: subScoreCoverage,
      debt: subScoreDebt,
      insurance: subScoreInsurance,
      incomeStability: subScoreStability,
    },
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
