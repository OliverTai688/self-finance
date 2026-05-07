"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/infrastructure/repositories/profile-repository";

const DEMO_EVENT = "finance:demo-mode-changed";

function read(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEYS.demoMode) === "1";
}

function write(on: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.demoMode, on ? "1" : "0");
  window.dispatchEvent(new Event(DEMO_EVENT));
}

export function useDemoMode() {
  const [demoMode, setDemoModeState] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDemoModeState(read());
    setHydrated(true);
    const onChange = () => setDemoModeState(read());
    if (typeof window !== "undefined") {
      window.addEventListener(DEMO_EVENT, onChange);
      window.addEventListener("storage", onChange);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(DEMO_EVENT, onChange);
        window.removeEventListener("storage", onChange);
      }
    };
  }, []);

  const setDemoMode = useCallback((on: boolean) => {
    write(on);
    setDemoModeState(on);
  }, []);

  const toggle = useCallback(() => {
    setDemoMode(!demoMode);
  }, [demoMode, setDemoMode]);

  return { demoMode, setDemoMode, toggle, hydrated };
}
