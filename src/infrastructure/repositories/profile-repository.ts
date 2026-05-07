import type { FinancialProfile } from "@/domain/types";

export interface ProfileRepository {
  get(): Promise<FinancialProfile | null>;
  save(profile: FinancialProfile): Promise<void>;
  clear(): Promise<void>;
}

const STORAGE_KEY = "finance:profile:v1";

export class LocalStorageProfileRepository implements ProfileRepository {
  private readonly storageKey: string;

  constructor(storageKey: string = STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  async get(): Promise<FinancialProfile | null> {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as FinancialProfile;
    } catch {
      return null;
    }
  }

  async save(profile: FinancialProfile): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(this.storageKey, JSON.stringify(profile));
  }

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(this.storageKey);
  }
}

export const STORAGE_KEYS = {
  profile: STORAGE_KEY,
  demoMode: "finance:demo-mode:v1",
} as const;
