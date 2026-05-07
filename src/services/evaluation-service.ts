import { evaluateFinancialArchitecture } from "@/domain/evaluate";
import type { EvaluationResult, FinancialProfile } from "@/domain/types";

export function evaluateProfile(
  profile: FinancialProfile,
): EvaluationResult {
  return evaluateFinancialArchitecture(profile);
}
