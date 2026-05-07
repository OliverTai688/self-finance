"use client";

import { useMemo } from "react";
import type { EvaluationResult, FinancialProfile } from "@/domain/types";
import { evaluateProfile } from "@/services/evaluation-service";

export function useEvaluation(
  profile: FinancialProfile | null,
): EvaluationResult | null {
  return useMemo(() => {
    if (!profile) return null;
    try {
      return evaluateProfile(profile);
    } catch {
      return null;
    }
  }, [profile]);
}
