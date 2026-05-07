"use client";

import React, { createContext, useContext, ReactNode } from "react";
import type { EvaluationResult, FinancialProfile } from "@/domain/types";
import { useActiveProfile } from "@/hooks/use-active-profile";
import { useEvaluation } from "@/hooks/use-evaluation";

interface FinanceDataContextType {
  profile: FinancialProfile | null;
  evaluation: EvaluationResult | null;
  isDemo: boolean;
  loading: boolean;
}

const FinanceDataContext = createContext<FinanceDataContextType | undefined>(
  undefined,
);

export function FinanceDataProvider({ children }: { children: ReactNode }) {
  const { profile, isDemo, loading } = useActiveProfile();
  const evaluation = useEvaluation(profile);

  const value = {
    profile,
    evaluation,
    isDemo,
    loading,
  };

  return (
    <FinanceDataContext.Provider value={value}>
      {children}
    </FinanceDataContext.Provider>
  );
}

export function useFinanceData() {
  const context = useContext(FinanceDataContext);
  if (context === undefined) {
    throw new Error("useFinanceData must be used within a FinanceDataProvider");
  }
  return context;
}
