"use client";

import { useCallback, useEffect, useState } from "react";
import type { FinancialProfile } from "@/domain/types";
import {
  clearProfile,
  loadProfile,
  saveProfile,
} from "@/services/profile-service";

const PROFILE_EVENT = "finance:profile-changed";

function emitChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PROFILE_EVENT));
  }
}

export function useUserProfile() {
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const p = await loadProfile();
    setProfile(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    if (typeof window !== "undefined") {
      window.addEventListener(PROFILE_EVENT, onChange);
      window.addEventListener("storage", onChange);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(PROFILE_EVENT, onChange);
        window.removeEventListener("storage", onChange);
      }
    };
  }, [refresh]);

  const save = useCallback(async (next: FinancialProfile) => {
    await saveProfile(next);
    emitChange();
  }, []);

  const clear = useCallback(async () => {
    await clearProfile();
    emitChange();
  }, []);

  return { profile, loading, save, clear, refresh };
}
