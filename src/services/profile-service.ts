import { getProfileRepository } from "@/infrastructure/repositories";
import type { FinancialProfile } from "@/domain/types";

export async function loadProfile(): Promise<FinancialProfile | null> {
  return getProfileRepository().get();
}

export async function saveProfile(profile: FinancialProfile): Promise<void> {
  const next: FinancialProfile = {
    ...profile,
    profile: {
      ...profile.profile,
      updatedAt: new Date().toISOString(),
    },
  };
  await getProfileRepository().save(next);
}

export async function clearProfile(): Promise<void> {
  await getProfileRepository().clear();
}
