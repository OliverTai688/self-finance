"use client";

import { NumberField } from "./Field";
import type { Currency, PersonalFinanceLayer } from "@/domain/types";

interface Props {
  value: PersonalFinanceLayer;
  currency: Currency;
  onChange: (next: PersonalFinanceLayer) => void;
}

export default function PersonalFinanceForm({
  value,
  currency,
  onChange,
}: Props) {
  const update = <K extends keyof PersonalFinanceLayer>(
    key: K,
    v: PersonalFinanceLayer[K],
  ) => onChange({ ...value, [key]: v });

  const cur = currency === "USD" ? "$" : "NT$";

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <NumberField
        id="pf-fixed"
        label="月固定收入"
        value={value.monthlyIncomeFixed}
        onChange={(n) => update("monthlyIncomeFixed", n)}
        suffix={cur}
        min={0}
      />
      <NumberField
        id="pf-variable"
        label="月變動收入（12 月平均）"
        value={value.monthlyIncomeVariableAvg12m}
        onChange={(n) => update("monthlyIncomeVariableAvg12m", n)}
        suffix={cur}
        hint="系統會自動以 0.7 折扣計算覆蓋率"
        min={0}
      />
      <NumberField
        id="pf-essential"
        label="月必要支出"
        value={value.monthlyEssentialExpense}
        onChange={(n) => update("monthlyEssentialExpense", n)}
        suffix={cur}
        hint="房租、保費、飲食、交通、孝親"
        min={0}
      />
      <NumberField
        id="pf-nonessential"
        label="月非必要支出"
        value={value.monthlyNonEssentialExpense}
        onChange={(n) => update("monthlyNonEssentialExpense", n)}
        suffix={cur}
        min={0}
      />
      <NumberField
        id="pf-emergency"
        label="緊急金"
        value={value.emergencyFundCash}
        onChange={(n) => update("emergencyFundCash", n)}
        suffix={cur}
        hint="現金 / 活存 / 高流動貨幣基金"
        min={0}
      />
      <NumberField
        id="pf-target-lifestyle"
        label="期望未來月生活費"
        value={value.targetLifestyleMonthlyCost}
        onChange={(n) => update("targetLifestyleMonthlyCost", n)}
        suffix={cur}
        min={0}
      />
      <NumberField
        id="pf-debt-balance"
        label="高利負債餘額"
        value={value.highInterestDebtBalance}
        onChange={(n) => update("highInterestDebtBalance", n)}
        suffix={cur}
        hint="信用卡循環 / 信貸"
        min={0}
      />
      <NumberField
        id="pf-debt-rate"
        label="高利負債年利率"
        value={value.highInterestDebtRate}
        onChange={(n) => update("highInterestDebtRate", n)}
        suffix="0~1"
        step={0.01}
        hint="例：18% → 0.18。高於長期報酬預期會觸發優先還債建議"
        min={0}
        max={1}
      />
      <NumberField
        id="pf-debt-monthly"
        label="月債務還款"
        value={value.debtMonthlyPayment}
        onChange={(n) => update("debtMonthlyPayment", n)}
        suffix={cur}
        min={0}
      />
      <NumberField
        id="pf-insurance"
        label="保險覆蓋分數"
        value={value.insuranceCoverageScore}
        onChange={(n) => update("insuranceCoverageScore", n)}
        suffix="/100"
        hint="自評 0–100：醫療、意外、收入中斷、責任險完整度"
        min={0}
        max={100}
      />
      <NumberField
        id="pf-relocation"
        label="移民/換城市計畫年數"
        value={value.relocationGoalYears ?? 0}
        onChange={(n) => update("relocationGoalYears", n > 0 ? n : null)}
        suffix="年"
        hint="未規劃留 0"
        min={0}
      />
    </div>
  );
}
