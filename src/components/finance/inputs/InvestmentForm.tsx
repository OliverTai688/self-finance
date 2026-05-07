"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, NumberField } from "./Field";
import { createId } from "@/lib/ids";
import type {
  Currency,
  InvestmentCategory,
  InvestmentItem,
  InvestmentLayer,
  LaborIncomeCorrelation,
  RiskTolerance,
} from "@/domain/types";

interface Props {
  value: InvestmentLayer;
  currency: Currency;
  onChange: (next: InvestmentLayer) => void;
}

const CATEGORIES: { value: InvestmentCategory; label: string }[] = [
  { value: "cash", label: "現金 / 活存" },
  { value: "bond", label: "債券" },
  { value: "equity_etf", label: "股票 ETF" },
  { value: "single_stock", label: "個股" },
  { value: "crypto", label: "加密貨幣" },
  { value: "business_equity", label: "事業股權" },
  { value: "other", label: "其他" },
];

export default function InvestmentForm({ value, currency, onChange }: Props) {
  const cur = currency === "USD" ? "$" : "NT$";
  const update = <K extends keyof InvestmentLayer>(
    key: K,
    v: InvestmentLayer[K],
  ) => onChange({ ...value, [key]: v });

  const updateItem = (id: string, patch: Partial<InvestmentItem>) => {
    update(
      "items",
      value.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    );
  };

  const removeItem = (id: string) => {
    update("items", value.items.filter((i) => i.id !== id));
  };

  const addItem = () => {
    const item: InvestmentItem = {
      id: createId("inv"),
      name: "",
      category: "equity_etf",
      marketValue: 0,
      monthlyContribution: 0,
      liquidityLevel: 4,
      concentrationRiskLevel: 3,
    };
    update("items", [...value.items, item]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <NumberField
          id="inv-rebalance"
          label="再平衡頻率（月）"
          value={value.rebalancingFrequencyMonths}
          onChange={(n) => update("rebalancingFrequencyMonths", n)}
          hint="3–6 月最佳；> 18 月會扣分"
          min={0}
        />
        <NumberField
          id="inv-max-pos"
          label="單一部位上限目標"
          value={value.maxSinglePositionRatioTarget}
          onChange={(n) => update("maxSinglePositionRatioTarget", n)}
          step={0.05}
          hint="0~1，例 0.20 = 20%"
          min={0}
          max={1}
        />
        <Field label="風險承受度" htmlFor="inv-risk">
          <Select
            value={value.riskTolerance}
            onValueChange={(v) =>
              update("riskTolerance", v as RiskTolerance)
            }
          >
            <SelectTrigger id="inv-risk">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="high">高</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field
          label="勞動收入與市場關聯度"
          htmlFor="inv-labor"
          hint="高（科技、金融）→ 系統會降低建議風險資產比"
        >
          <Select
            value={value.laborIncomeCorrelationToMarket}
            onValueChange={(v) =>
              update("laborIncomeCorrelationToMarket", v as LaborIncomeCorrelation)
            }
          >
            <SelectTrigger id="inv-labor">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="high">高</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">投資部位</h4>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus size={14} /> 新增部位
          </Button>
        </div>

        {value.items.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            尚無投資部位。點「新增部位」開始。
          </p>
        )}

        <div className="space-y-3">
          {value.items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-base">
                      <Input
                        value={item.name}
                        placeholder="部位名稱"
                        onChange={(e) =>
                          updateItem(item.id, { name: e.target.value })
                        }
                        className="h-8 border-0 px-0 text-base font-semibold focus-visible:ring-0"
                      />
                    </CardTitle>
                    <CardDescription>
                      {CATEGORIES.find((c) => c.value === item.category)?.label}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    aria-label="移除部位"
                  >
                    <Trash2 size={16} className="text-muted-foreground" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Field label="類別" htmlFor={`cat-${item.id}`}>
                  <Select
                    value={item.category}
                    onValueChange={(v) =>
                      updateItem(item.id, {
                        category: v as InvestmentCategory,
                      })
                    }
                  >
                    <SelectTrigger id={`cat-${item.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <NumberField
                  id={`mv-${item.id}`}
                  label="市值"
                  value={item.marketValue}
                  onChange={(n) => updateItem(item.id, { marketValue: n })}
                  suffix={cur}
                  min={0}
                />
                <NumberField
                  id={`mc-${item.id}`}
                  label="月定期投入"
                  value={item.monthlyContribution}
                  onChange={(n) =>
                    updateItem(item.id, { monthlyContribution: n })
                  }
                  suffix={cur}
                  min={0}
                />
                <NumberField
                  id={`lq-${item.id}`}
                  label="流動性 (1–5)"
                  value={item.liquidityLevel}
                  onChange={(n) =>
                    updateItem(item.id, {
                      liquidityLevel: clampLevel(n),
                    })
                  }
                  hint="5 = 最高（現金、ETF）"
                  min={1}
                  max={5}
                />
                <NumberField
                  id={`cr-${item.id}`}
                  label="集中度風險 (1–5)"
                  value={item.concentrationRiskLevel}
                  onChange={(n) =>
                    updateItem(item.id, {
                      concentrationRiskLevel: clampLevel(n),
                    })
                  }
                  hint="5 = 最高（單一個股、單一加密貨幣）"
                  min={1}
                  max={5}
                />
                <NumberField
                  id={`er-${item.id}`}
                  label="預期年報酬"
                  value={item.expectedReturnAnnual ?? 0}
                  onChange={(n) =>
                    updateItem(item.id, { expectedReturnAnnual: n })
                  }
                  step={0.005}
                  suffix="0~1"
                  hint="例：0.07 = 7%"
                  min={-1}
                  max={2}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function clampLevel(n: number): 1 | 2 | 3 | 4 | 5 {
  const r = Math.max(1, Math.min(5, Math.round(n)));
  return r as 1 | 2 | 3 | 4 | 5;
}
