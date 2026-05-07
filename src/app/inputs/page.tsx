"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Save, RotateCcw, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/layout/PageHeader";
import ProfileBasicsForm from "@/components/finance/inputs/ProfileBasicsForm";
import PersonalFinanceForm from "@/components/finance/inputs/PersonalFinanceForm";
import InvestmentForm from "@/components/finance/inputs/InvestmentForm";
import IncomeForm from "@/components/finance/inputs/IncomeForm";
import GoalsForm from "@/components/finance/inputs/GoalsForm";
import { useUserProfile } from "@/hooks/use-profile";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { createEmptyProfile } from "@/domain/empty";
import { demoProfileFor } from "@/domain/demo";
import type { FinancialProfile } from "@/domain/types";

export default function InputsPage() {
  const router = useRouter();
  const { profile, loading, save, clear } = useUserProfile();
  const { demoMode } = useDemoMode();
  const [draft, setDraft] = useState<FinancialProfile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    setDraft((prev) => prev ?? profile ?? createEmptyProfile());
  }, [profile, loading]);

  if (!draft) {
    return (
      <div className="space-y-8">
        <PageHeader title="資料輸入" description="載入中…" />
      </div>
    );
  }

  const onSubmit = async () => {
    setSaving(true);
    await save(draft);
    setSaving(false);
    router.push("/");
  };

  const onReset = async () => {
    if (!confirm("確定要清除你輸入的資料？此動作不可回復。")) return;
    await clear();
    setDraft(createEmptyProfile(draft.profile.currency));
  };

  const loadDemo = () => {
    setDraft(demoProfileFor(draft.profile.currency));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="資料輸入"
        description="填入三層資料後自動計算分數與建議。"
        right={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft size={14} /> 回 Dashboard
            </Link>
          </Button>
        }
      />

      {demoMode && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          Demo 資料目前開著；你在這裡的編輯會存入「你的資料」，不影響 Demo。
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>財務資料</CardTitle>
          <CardDescription>
            所有數字都以 {draft.profile.currency} 計價；可隨時切換幣別。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted p-1">
              <TabsTrigger value="basics">基本資料</TabsTrigger>
              <TabsTrigger value="l1">L1 · 防禦</TabsTrigger>
              <TabsTrigger value="l2">L2 · 投資</TabsTrigger>
              <TabsTrigger value="l3">L3 · 收入引擎</TabsTrigger>
              <TabsTrigger value="goals">目標</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="mt-6">
              <ProfileBasicsForm
                value={draft.profile}
                onChange={(p) => setDraft({ ...draft, profile: p })}
              />
            </TabsContent>
            <TabsContent value="l1" className="mt-6">
              <PersonalFinanceForm
                value={draft.personalFinance}
                currency={draft.profile.currency}
                onChange={(pf) =>
                  setDraft({ ...draft, personalFinance: pf })
                }
              />
            </TabsContent>
            <TabsContent value="l2" className="mt-6">
              <InvestmentForm
                value={draft.investment}
                currency={draft.profile.currency}
                onChange={(inv) => setDraft({ ...draft, investment: inv })}
              />
            </TabsContent>
            <TabsContent value="l3" className="mt-6">
              <IncomeForm
                value={draft.incomeGeneration}
                currency={draft.profile.currency}
                onChange={(ig) =>
                  setDraft({ ...draft, incomeGeneration: ig })
                }
              />
            </TabsContent>
            <TabsContent value="goals" className="mt-6">
              <GoalsForm
                value={draft.goals}
                currency={draft.profile.currency}
                onChange={(g) => setDraft({ ...draft, goals: g })}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/90 p-3 shadow-lg backdrop-blur">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadDemo}>
            <Sparkles size={14} /> 用 Demo 填入
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw size={14} /> 清除
          </Button>
        </div>
        <Button onClick={onSubmit} disabled={saving} size="lg">
          <Save size={16} /> {saving ? "儲存中…" : "儲存並回 Dashboard"}
        </Button>
      </div>
    </div>
  );
}
