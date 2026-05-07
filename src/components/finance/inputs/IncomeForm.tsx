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
import { Switch } from "@/components/ui/switch";
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
  GeoMode,
  IncomeEngine,
  IncomeEngineType,
  IncomeGenerationLayer,
} from "@/domain/types";

interface Props {
  value: IncomeGenerationLayer;
  currency: Currency;
  onChange: (next: IncomeGenerationLayer) => void;
}

const TYPES: { value: IncomeEngineType; label: string }[] = [
  { value: "salary", label: "正職薪資" },
  { value: "freelance", label: "接案 / 自由業" },
  { value: "ecommerce", label: "電商" },
  { value: "saas", label: "SaaS / 軟體產品" },
  { value: "course", label: "課程 / 教學" },
  { value: "consulting", label: "顧問" },
  { value: "other", label: "其他" },
];

export default function IncomeForm({ value, currency, onChange }: Props) {
  const cur = currency === "USD" ? "$" : "NT$";
  const update = <K extends keyof IncomeGenerationLayer>(
    key: K,
    v: IncomeGenerationLayer[K],
  ) => onChange({ ...value, [key]: v });

  const updateEngine = (id: string, patch: Partial<IncomeEngine>) => {
    update(
      "engines",
      value.engines.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    );
  };

  const removeEngine = (id: string) => {
    update("engines", value.engines.filter((e) => e.id !== id));
  };

  const addEngine = () => {
    const e: IncomeEngine = {
      id: createId("eng"),
      name: "",
      type: "freelance",
      monthlyRevenueAvg6m: 0,
      monthlyCostAvg6m: 0,
      monthlyHoursAvg6m: 0,
      growthRate6m: 0,
      volatility6m: 0.2,
      ownerDependencyScore: 80,
      scalabilityScore: 30,
      automationScore: 20,
      moatScore: 30,
      sixMonthPositiveNcf: false,
      ownerDependencyTrend: "flat",
    };
    update("engines", [...value.engines, e]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <NumberField
          id="ig-people"
          label="期望支撐人口"
          value={value.targetPeopleSupported}
          onChange={(n) => update("targetPeopleSupported", n)}
          min={1}
        />
        <Field label="目標地理模式" htmlFor="ig-geo">
          <Select
            value={value.targetGeoMode}
            onValueChange={(v) => update("targetGeoMode", v as GeoMode)}
          >
            <SelectTrigger id="ig-geo">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="taiwan">台灣</SelectItem>
              <SelectItem value="dual_country">雙城 / 跨國</SelectItem>
              <SelectItem value="europe">歐洲</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <NumberField
          id="ig-fi-years"
          label="期望財務獨立年數"
          value={value.targetFinancialIndependenceYears}
          onChange={(n) => update("targetFinancialIndependenceYears", n)}
          suffix="年"
          min={0}
        />
        <Field
          label="是否有創業意圖"
          htmlFor="ig-intent"
          hint="觸發 Rule 3：單一雇主依賴度過高時建議建立第二引擎"
        >
          <div className="flex h-10 items-center gap-3 rounded-md border border-input bg-background px-3">
            <Switch
              id="ig-intent"
              checked={value.entrepreneurshipIntent}
              onCheckedChange={(v) => update("entrepreneurshipIntent", v)}
            />
            <span className="text-sm text-muted-foreground">
              {value.entrepreneurshipIntent ? "是" : "否"}
            </span>
          </div>
        </Field>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">收入引擎</h4>
          <Button variant="outline" size="sm" onClick={addEngine}>
            <Plus size={14} /> 新增引擎
          </Button>
        </div>

        {value.engines.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            尚無收入引擎。點「新增引擎」開始。
          </p>
        )}

        <div className="space-y-3">
          {value.engines.map((engine) => (
            <Card key={engine.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-base">
                      <Input
                        value={engine.name}
                        placeholder="引擎名稱"
                        onChange={(e) =>
                          updateEngine(engine.id, { name: e.target.value })
                        }
                        className="h-8 border-0 px-0 text-base font-semibold focus-visible:ring-0"
                      />
                    </CardTitle>
                    <CardDescription>
                      {TYPES.find((t) => t.value === engine.type)?.label}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEngine(engine.id)}
                    aria-label="移除引擎"
                  >
                    <Trash2 size={16} className="text-muted-foreground" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Field label="類型" htmlFor={`type-${engine.id}`}>
                  <Select
                    value={engine.type}
                    onValueChange={(v) =>
                      updateEngine(engine.id, { type: v as IncomeEngineType })
                    }
                  >
                    <SelectTrigger id={`type-${engine.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <NumberField
                  id={`rev-${engine.id}`}
                  label="月營收（6 月平均）"
                  value={engine.monthlyRevenueAvg6m}
                  onChange={(n) =>
                    updateEngine(engine.id, { monthlyRevenueAvg6m: n })
                  }
                  suffix={cur}
                  min={0}
                />
                <NumberField
                  id={`cost-${engine.id}`}
                  label="月成本（6 月平均）"
                  value={engine.monthlyCostAvg6m}
                  onChange={(n) =>
                    updateEngine(engine.id, { monthlyCostAvg6m: n })
                  }
                  suffix={cur}
                  min={0}
                />
                <NumberField
                  id={`hrs-${engine.id}`}
                  label="月投入時數"
                  value={engine.monthlyHoursAvg6m}
                  onChange={(n) =>
                    updateEngine(engine.id, { monthlyHoursAvg6m: n })
                  }
                  suffix="hrs"
                  min={0}
                />
                <NumberField
                  id={`grw-${engine.id}`}
                  label="6 月成長率"
                  value={engine.growthRate6m}
                  onChange={(n) =>
                    updateEngine(engine.id, { growthRate6m: n })
                  }
                  step={0.01}
                  hint="例：0.10 = +10%"
                />
                <NumberField
                  id={`vol-${engine.id}`}
                  label="6 月波動率"
                  value={engine.volatility6m}
                  onChange={(n) =>
                    updateEngine(engine.id, { volatility6m: n })
                  }
                  step={0.05}
                  hint="0~1，營收標準差/均值"
                  min={0}
                  max={1}
                />
                <NumberField
                  id={`own-${engine.id}`}
                  label="擁有者依賴度"
                  value={engine.ownerDependencyScore}
                  onChange={(n) =>
                    updateEngine(engine.id, { ownerDependencyScore: n })
                  }
                  suffix="/100"
                  hint="100 = 完全綁本人"
                  min={0}
                  max={100}
                />
                <NumberField
                  id={`scl-${engine.id}`}
                  label="可擴張性"
                  value={engine.scalabilityScore}
                  onChange={(n) =>
                    updateEngine(engine.id, { scalabilityScore: n })
                  }
                  suffix="/100"
                  min={0}
                  max={100}
                />
                <NumberField
                  id={`aut-${engine.id}`}
                  label="自動化程度"
                  value={engine.automationScore}
                  onChange={(n) =>
                    updateEngine(engine.id, { automationScore: n })
                  }
                  suffix="/100"
                  min={0}
                  max={100}
                />
                <NumberField
                  id={`mot-${engine.id}`}
                  label="護城河"
                  value={engine.moatScore}
                  onChange={(n) =>
                    updateEngine(engine.id, { moatScore: n })
                  }
                  suffix="/100"
                  min={0}
                  max={100}
                />
                <Field
                  label="近 6 月淨現金流為正"
                  htmlFor={`pos-${engine.id}`}
                >
                  <div className="flex h-10 items-center gap-3 rounded-md border border-input bg-background px-3">
                    <Switch
                      id={`pos-${engine.id}`}
                      checked={engine.sixMonthPositiveNcf}
                      onCheckedChange={(v) =>
                        updateEngine(engine.id, { sixMonthPositiveNcf: v })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {engine.sixMonthPositiveNcf ? "是" : "否"}
                    </span>
                  </div>
                </Field>
                <Field
                  label="擁有者依賴趨勢"
                  htmlFor={`trd-${engine.id}`}
                >
                  <Select
                    value={engine.ownerDependencyTrend}
                    onValueChange={(v) =>
                      updateEngine(engine.id, {
                        ownerDependencyTrend: v as IncomeEngine["ownerDependencyTrend"],
                      })
                    }
                  >
                    <SelectTrigger id={`trd-${engine.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rising">上升中</SelectItem>
                      <SelectItem value="flat">持平</SelectItem>
                      <SelectItem value="falling">下降中</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
