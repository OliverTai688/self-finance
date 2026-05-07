export type Currency = "TWD" | "USD";

export type RiskTolerance = "low" | "medium" | "high";
export type LaborIncomeCorrelation = "low" | "medium" | "high";
export type GeoMode = "taiwan" | "dual_country" | "europe";

export type InvestmentCategory =
  | "cash"
  | "bond"
  | "equity_etf"
  | "single_stock"
  | "crypto"
  | "business_equity"
  | "other";

export type IncomeEngineType =
  | "salary"
  | "freelance"
  | "ecommerce"
  | "saas"
  | "course"
  | "consulting"
  | "other";

export interface Profile {
  id: string;
  name?: string;
  age: number;
  occupation: string;
  country: string;
  dependentsCount: number;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalFinanceLayer {
  monthlyIncomeFixed: number;
  monthlyIncomeVariableAvg12m: number;
  monthlyEssentialExpense: number;
  monthlyNonEssentialExpense: number;
  emergencyFundCash: number;
  highInterestDebtBalance: number;
  highInterestDebtRate: number;
  debtMonthlyPayment: number;
  insuranceCoverageScore: number;
  targetLifestyleMonthlyCost: number;
  relocationGoalYears: number | null;
}

export interface InvestmentItem {
  id: string;
  name: string;
  category: InvestmentCategory;
  marketValue: number;
  monthlyContribution: number;
  expectedReturnAnnual?: number;
  expectedVolatilityAnnual?: number;
  liquidityLevel: 1 | 2 | 3 | 4 | 5;
  concentrationRiskLevel: 1 | 2 | 3 | 4 | 5;
}

export interface InvestmentLayer {
  items: InvestmentItem[];
  rebalancingFrequencyMonths: number;
  maxSinglePositionRatioTarget: number;
  riskTolerance: RiskTolerance;
  laborIncomeCorrelationToMarket: LaborIncomeCorrelation;
}

export interface IncomeEngine {
  id: string;
  name: string;
  type: IncomeEngineType;
  monthlyRevenueAvg6m: number;
  monthlyCostAvg6m: number;
  monthlyHoursAvg6m: number;
  growthRate6m: number;
  volatility6m: number;
  ownerDependencyScore: number;
  scalabilityScore: number;
  moatScore: number;
  automationScore: number;
  sixMonthPositiveNcf: boolean;
  ownerDependencyTrend: "rising" | "flat" | "falling";
}

export interface IncomeGenerationLayer {
  engines: IncomeEngine[];
  targetPeopleSupported: number;
  targetGeoMode: GeoMode;
  targetFinancialIndependenceYears: number;
  entrepreneurshipIntent: boolean;
}

export interface Goals {
  targetRetirementAge?: number;
  targetMigrationYear?: number;
  targetBusinessLaunchYear?: number;
  targetMonthlyCostSingle: number;
  targetMonthlyCostThreePeople: number;
  targetMonthlyCostEurope: number;
  semiPassiveAnnualIncome: number;
}

export interface FinancialProfile {
  profile: Profile;
  personalFinance: PersonalFinanceLayer;
  investment: InvestmentLayer;
  incomeGeneration: IncomeGenerationLayer;
  goals: Goals;
}

export interface Layer1Result {
  score: number;
  emergencyFundMonths: number;
  emergencyFundTargetMonths: number;
  coverageRatio: number;
  debtServiceRatio: number;
  dependentsCoefficient: number;
  incomeStabilityRatio: number;
  subScores: {
    emergencyFund: number;
    coverage: number;
    debt: number;
    insurance: number;
    incomeStability: number;
  };
}

export interface Layer2Result {
  score: number;
  hhi: number;
  diversificationScore: number;
  liquidAssetRatio: number;
  riskAssetRatio: number;
  riskAssetRatioAdjusted: number;
  humanCapitalAdjustment: number;
  targetRiskAssetRange: [number, number];
  allocationFitScore: number;
  investmentContributionRatio: number;
  rebalancingDisciplineScore: number;
  subScores: {
    diversification: number;
    allocationFit: number;
    liquidity: number;
    contributionRate: number;
    rebalancing: number;
  };
}

export interface EngineScoreBreakdown {
  engineId: string;
  name: string;
  netCashFlow: number;
  ownerAdjustedNcf: number;
  timeLeverageRatio: number;
  score: number;
  weight: number;
  subScores: {
    profitability: number;
    stability: number;
    scalability: number;
    automation: number;
    moat: number;
  };
}

export interface Layer3Result {
  score: number;
  incomeDiversificationScore: number;
  hhi: number;
  ownerAdjustedIncomeTotal: number;
  engines: EngineScoreBreakdown[];
}

export interface TargetAnalysis {
  requiredAssetsAggressiveSingle: number;
  requiredAssetsBaseSingle: number;
  requiredAssetsConservativeSingle: number;
  requiredAssetsAggressiveThree: number;
  requiredAssetsBaseThree: number;
  requiredAssetsConservativeThree: number;
  requiredAssetsAggressiveEurope: number;
  requiredAssetsBaseEurope: number;
  requiredAssetsConservativeEurope: number;
  adjustedRequiredAssetsBaseSingle: number;
  adjustedRequiredAssetsBaseThree: number;
  adjustedRequiredAssetsBaseEurope: number;
  fundingGapSingle: number;
  fundingGapThreePeople: number;
  fundingGapEurope: number;
}

export type ArchetypeLabel =
  | "defense_weak"
  | "investment_imbalanced"
  | "engine_immature"
  | "balanced";

export interface Recommendation {
  id: string;
  priority: 1 | 2 | 3;
  layer: 1 | 2 | 3 | 0;
  title: string;
  detail: string;
  suggestedCashAllocationPct?: number;
}

export interface EvaluationResult {
  scores: {
    layer1Defense: number;
    layer2Investment: number;
    layer3IncomeGeneration: number;
    total: number;
  };
  layer1: Layer1Result;
  layer2: Layer2Result;
  layer3: Layer3Result;
  targets: TargetAnalysis;
  archetype: ArchetypeLabel;
  recommendations: Recommendation[];
}
