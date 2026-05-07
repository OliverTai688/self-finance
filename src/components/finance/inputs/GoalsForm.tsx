"use client";

import { NumberField } from "./Field";
import type { Currency, Goals } from "@/domain/types";

interface Props {
  value: Goals;
  currency: Currency;
  onChange: (next: Goals) => void;
}

export default function GoalsForm({ value, currency, onChange }: Props) {
  const cur = currency === "USD" ? "$" : "NT$";
  const update = <K extends keyof Goals>(key: K, v: Goals[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <NumberField
        id="g-cost-single"
        label="一人生活月成本"
        value={value.targetMonthlyCostSingle}
        onChange={(n) => update("targetMonthlyCostSingle", n)}
        suffix={cur}
        min={0}
      />
      <NumberField
        id="g-cost-three"
        label="三人生活月成本"
        value={value.targetMonthlyCostThreePeople}
        onChange={(n) => update("targetMonthlyCostThreePeople", n)}
        suffix={cur}
        min={0}
      />
      <NumberField
        id="g-cost-europe"
        label="歐洲模式月成本"
        value={value.targetMonthlyCostEurope}
        onChange={(n) => update("targetMonthlyCostEurope", n)}
        suffix={cur}
        min={0}
      />
      <NumberField
        id="g-passive"
        label="預期年半被動收入"
        value={value.semiPassiveAnnualIncome}
        onChange={(n) => update("semiPassiveAnnualIncome", n)}
        suffix={cur}
        hint="退休/移民後仍會有的 SaaS / 顧問 / 租金等"
        min={0}
      />
      <NumberField
        id="g-retire"
        label="目標退休年齡"
        value={value.targetRetirementAge ?? 0}
        onChange={(n) => update("targetRetirementAge", n > 0 ? n : undefined)}
        min={0}
      />
      <NumberField
        id="g-migrate"
        label="目標移民年份"
        value={value.targetMigrationYear ?? 0}
        onChange={(n) => update("targetMigrationYear", n > 0 ? n : undefined)}
        min={0}
      />
      <NumberField
        id="g-launch"
        label="目標創業年份"
        value={value.targetBusinessLaunchYear ?? 0}
        onChange={(n) =>
          update("targetBusinessLaunchYear", n > 0 ? n : undefined)
        }
        min={0}
      />
    </div>
  );
}
