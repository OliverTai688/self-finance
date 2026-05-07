import type { Currency, FinancialProfile } from "./types";
import { createId } from "@/lib/ids";

export function createEmptyProfile(currency: Currency = "TWD"): FinancialProfile {
  const now = new Date().toISOString();
  return {
    profile: {
      id: createId("profile"),
      name: "",
      age: 30,
      occupation: "",
      country: currency === "USD" ? "US" : "TW",
      dependentsCount: 0,
      currency,
      createdAt: now,
      updatedAt: now,
    },
    personalFinance: {
      monthlyIncomeFixed: 0,
      monthlyIncomeVariableAvg12m: 0,
      monthlyEssentialExpense: 0,
      monthlyNonEssentialExpense: 0,
      emergencyFundCash: 0,
      highInterestDebtBalance: 0,
      highInterestDebtRate: 0,
      debtMonthlyPayment: 0,
      insuranceCoverageScore: 50,
      targetLifestyleMonthlyCost: 0,
      relocationGoalYears: null,
    },
    investment: {
      items: [],
      rebalancingFrequencyMonths: 6,
      maxSinglePositionRatioTarget: 0.2,
      riskTolerance: "medium",
      laborIncomeCorrelationToMarket: "medium",
    },
    incomeGeneration: {
      engines: [],
      targetPeopleSupported: 1,
      targetGeoMode: "taiwan",
      targetFinancialIndependenceYears: 20,
      entrepreneurshipIntent: false,
    },
    goals: {
      targetMonthlyCostSingle: 0,
      targetMonthlyCostThreePeople: 0,
      targetMonthlyCostEurope: 0,
      semiPassiveAnnualIncome: 0,
    },
  };
}
