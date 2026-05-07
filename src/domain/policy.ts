export const defaultPolicy = {
  layerWeights: { l1: 0.4, l2: 0.3, l3: 0.3 },
  variableIncomeDiscount: 0.7,

  emergencyFundBaseTargetMonths: 9,
  dependentsCoefficientSlope: 0.15,

  debtServiceRatioWarning: 0.25,
  maxSinglePositionRatioTarget: 0.2,
  targetInvestmentContributionRatio: 0.2,
  targetIncomeEngineCount: 3,

  expectedLongTermReturnAnnual: 0.07,
  withdrawalRateAggressive: 0.04,
  withdrawalRateBase: 0.037,
  withdrawalRateConservative: 0.035,

  ownerDependencyAdjustmentFactor: 0.5,

  humanCapitalAdjustment: {
    high: 0.85,
    medium: 1.0,
    low: 1.1,
  },
} as const;

export type Policy = typeof defaultPolicy;
