"use client";

import { useMemo } from "react";
import type { Currency, FinancialProfile } from "@/domain/types";
import { demoProfileFor } from "@/domain/demo";
import { useUserProfile } from "./use-profile";
import { useDemoMode } from "./use-demo-mode";

interface UseActiveProfileResult {
  profile: FinancialProfile | null;
  isDemo: boolean;
  isEmpty: boolean;
  loading: boolean;
  demoCurrency: Currency;
}

export function useActiveProfile(): UseActiveProfileResult {
  const { profile, loading } = useUserProfile();
  const { demoMode, hydrated } = useDemoMode();

  const demoCurrency: Currency = profile?.profile.currency ?? "TWD";

  const active = useMemo<FinancialProfile | null>(() => {
    if (demoMode) return demoProfileFor(demoCurrency);
    return profile;
  }, [demoMode, profile, demoCurrency]);

  return {
    profile: active,
    isDemo: demoMode,
    isEmpty: !active,
    loading: loading || !hydrated,
    demoCurrency,
  };
}
