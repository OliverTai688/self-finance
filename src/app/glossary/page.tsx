"use client";

import { motion } from "motion/react";
import {
  BookOpen,
  Shield,
  PieChart,
  Rocket,
  Target,
  Workflow,
  Lightbulb,
  ScrollText,
  Scale,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/layout/PageHeader";

// --------- shared small components ---------

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-primary/10 bg-primary/[0.04] px-4 py-3 font-mono text-[13px] leading-relaxed tracking-tight text-foreground/90">
      {children}
    </div>
  );
}

function TermCard({
  term,
  english,
  plain,
  formula,
  why,
  icon: Icon,
  tint = "primary",
}: {
  term: string;
  english?: string;
  plain: string;
  formula?: React.ReactNode;
  why?: string;
  icon?: typeof Shield;
  tint?: "primary" | "emerald" | "violet" | "amber" | "rose";
}) {
  const tintClass = {
    primary: "text-primary bg-primary/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    violet: "text-violet-500 bg-violet-500/10",
    amber: "text-amber-500 bg-amber-500/10",
    rose: "text-rose-500 bg-rose-500/10",
  }[tint];

  return (
    <div className="group relative rounded-2xl border border-foreground/5 bg-foreground/[0.02] p-5 transition-all duration-300 hover:border-primary/20 hover:bg-foreground/[0.04]">
      <div className="flex items-start gap-3">
        {Icon && (
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${tintClass}`}
          >
            <Icon size={16} />
          </div>
        )}
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-base font-bold tracking-tight">{term}</h4>
            {english && (
              <Badge
                variant="outline"
                className="h-5 rounded-md border-foreground/10 bg-foreground/[0.03] text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {english}
              </Badge>
            )}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{plain}</p>
        </div>
      </div>
      {formula && <div className="mt-4">{formula}</div>}
      {why && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">
          <span className="mr-1 font-bold text-foreground/80">為什麼重要：</span>
          {why}
        </p>
      )}
    </div>
  );
}

function WeightRow({
  label,
  weight,
  detail,
}: {
  label: string;
  weight: string;
  detail: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-foreground/5 bg-foreground/[0.02] p-3">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
      </div>
      <Badge variant="outline" className="shrink-0 rounded-md font-mono tabular-nums">
        {weight}
      </Badge>
    </div>
  );
}

function ScoringBand({
  rows,
}: {
  rows: { condition: string; score: string; tone: "danger" | "warning" | "success" | "default" }[];
}) {
  const toneClass = {
    danger: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    default: "bg-primary/10 text-primary border-primary/20",
  };
  return (
    <div className="space-y-1.5">
      {rows.map((r) => (
        <div
          key={r.condition}
          className="flex items-center justify-between rounded-lg border border-foreground/5 bg-foreground/[0.02] px-3 py-2"
        >
          <span className="text-xs font-medium text-muted-foreground">{r.condition}</span>
          <Badge
            variant="outline"
            className={`rounded-md border text-[10px] font-bold tabular-nums ${toneClass[r.tone]}`}
          >
            {r.score}
          </Badge>
        </div>
      ))}
    </div>
  );
}

// --------- page ---------

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function GlossaryPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-24"
    >
      <PageHeader
        title="名詞與公式解釋"
        description="讀懂這套系統背後的財務語言、指標公式與演算法設計。不懂財務也沒關係，每個名詞都用白話說一次。"
      />

      {/* 系統是什麼 */}
      <motion.section variants={item} className="space-y-5">
        <SectionHeader
          icon={BookOpen}
          tint="primary"
          title="這不是理財工具，是你的決策作業系統"
          subtitle="它幫你每月回答：先補緊急金還是投資？要不要開新收入引擎？離三人生活還差多少？"
        />

        <Card className="glass-card overflow-hidden border-white/10">
          <CardContent className="grid gap-6 p-6 md:grid-cols-3">
            <IdeaBlock
              no="01"
              title="拆成三層系統"
              text="把財務拆成『防禦 / 投資 / 收入引擎』三層。每層的目的、風險、時間尺度不同，不該用同一個帳戶思維管理。"
            />
            <IdeaBlock
              no="02"
              title="每層都有一個分數"
              text="L1、L2、L3 各自 0–100 分。總分 = 0.4·L1 + 0.3·L2 + 0.3·L3，因為累積期、有收入波動的人，流動性比激進成長更優先。"
            />
            <IdeaBlock
              no="03"
              title="先補缺口，再談進攻"
              text="每一筆新增現金流都會被建議引擎判斷：先補防禦層、還高利債，還是加碼投資／建立新引擎。"
            />
          </CardContent>
        </Card>
      </motion.section>

      {/* 三層總覽 */}
      <motion.section variants={item} className="space-y-5">
        <SectionHeader
          icon={Scale}
          tint="violet"
          title="三層架構總覽"
          subtitle="每一層都在回答一個不同的問題。"
        />

        <div className="grid gap-5 md:grid-cols-3">
          <LayerCard
            layer="L1"
            icon={Shield}
            tint="emerald"
            title="個人財務防禦層"
            question="萬一收入斷了，我能撐多久？"
            pillars={["緊急金月數", "必要支出覆蓋率", "債務壓力比", "保險覆蓋", "收入穩定度"]}
            weightLabel="總分權重 40%"
          />
          <LayerCard
            layer="L2"
            icon={PieChart}
            tint="violet"
            title="投資配置層"
            question="我的資產配置有沒有過度集中或雙重曝險？"
            pillars={["資產分散度 (HHI)", "風險資產比", "人力資本修正", "流動性", "投入速度"]}
            weightLabel="總分權重 30%"
          />
          <LayerCard
            layer="L3"
            icon={Rocket}
            tint="amber"
            title="現實收入生成層"
            question="我的收入是不是只靠『我本人』？"
            pillars={["收入多樣性 (IDS)", "淨現金流 (NCF)", "時間槓桿", "擁有者依賴修正", "護城河／自動化"]}
            weightLabel="總分權重 30%"
          />
        </div>

        <Card className="border-foreground/5 bg-foreground/[0.02]">
          <CardHeader>
            <CardTitle className="text-lg">總分公式</CardTitle>
            <CardDescription>
              為什麼不是 1/3 平均？因為對累積期、有收入波動的人，先確保不崩比拚成長更重要。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Formula>Total Score = 0.40 × L1 + 0.30 × L2 + 0.30 × L3</Formula>
            <div className="grid gap-2 md:grid-cols-3">
              <WeightRow label="L1 權重" weight="0.40" detail="流動性與韌性優先" />
              <WeightRow label="L2 權重" weight="0.30" detail="資產成長與分散" />
              <WeightRow label="L3 權重" weight="0.30" detail="可擴張的真實收入" />
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* 分層細節 Tabs */}
      <motion.section variants={item} className="space-y-5">
        <SectionHeader
          icon={ScrollText}
          tint="primary"
          title="分層指標細節"
          subtitle="每個指標：白話定義 · 數學公式 · 打分規則 · 為什麼這樣算。"
        />

        <Tabs defaultValue="l1" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
            <TabsTrigger value="l1">L1 · 防禦</TabsTrigger>
            <TabsTrigger value="l2">L2 · 投資</TabsTrigger>
            <TabsTrigger value="l3">L3 · 收入</TabsTrigger>
            <TabsTrigger value="target">目標層</TabsTrigger>
          </TabsList>

          {/* L1 */}
          <TabsContent value="l1" className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Layer 1 · 個人財務防禦層</CardTitle>
                <CardDescription>
                  L1 = 0.35·EFM + 0.25·ECR + 0.15·DSR + 0.10·保險 + 0.15·收入穩定
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <TermCard
                  icon={Shield}
                  tint="emerald"
                  term="緊急備援月數"
                  english="EFM"
                  plain="你現在的現金＋高流動資產，能撐幾個月的必要支出。"
                  formula={<Formula>EFM = 緊急金現金 / 每月必要支出</Formula>}
                  why="CFPB 建議 3–6 個月；本系統預設更嚴格的 9 個月，因為使用者多為有收入波動、想創業或支撐多人的族群。"
                />
                <TermCard
                  icon={Scale}
                  tint="emerald"
                  term="必要支出覆蓋率"
                  english="ECR"
                  plain="固定收入加上『打七折後的變動收入』，能否蓋過每月必要支出。"
                  formula={
                    <Formula>
                      ECR = (固定月收入 + 0.7 × 變動月收入12月平均) / 每月必要支出
                    </Formula>
                  }
                  why="變動收入(接案)會停，所以打 7 折是實務風險折減。若更保守可用 0.5。"
                />
                <TermCard
                  icon={Scale}
                  tint="amber"
                  term="債務服務比"
                  english="DSR"
                  plain="每月還債佔總收入的比例，越高代表現金流越被鎖死。"
                  formula={<Formula>DSR = 每月還債金額 / (固定月收入 + 變動月收入)</Formula>}
                  why="超過 35% 被視為高壓；10% 以下最安全。高利負債應優先還清，不加碼投資。"
                />
                <TermCard
                  icon={Shield}
                  tint="amber"
                  term="扶養防禦係數"
                  english="DCF"
                  plain="要支撐的人越多，防禦層門檻就越高，不加分而是提高目標。"
                  formula={<Formula>DCF = 1 + 0.15 × 扶養人數</Formula>}
                  why="若想支撐三人，緊急金月數目標會從 9 月 → 約 12.6 月；系統自動拉高標準。"
                />
                <TermCard
                  icon={ScrollText}
                  tint="primary"
                  term="保險覆蓋分數"
                  english="Insurance Score"
                  plain="0–100 手動評估。重大傷病、實支實付、意外、壽險（若有扶養）是否到位。"
                  why="保險不是投資，是防止你一次大事件就回到原點。本系統留給使用者自行評分，因為保單差異大。"
                />
                <TermCard
                  icon={Scale}
                  tint="primary"
                  term="收入穩定度"
                  english="Income Stability"
                  plain="固定月收入佔總收入的比重。越高越穩定，越低越像自由工作者型。"
                  formula={<Formula>IS = 固定月收入 / (固定月收入 + 變動月收入)</Formula>}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">EFM 打分規則</CardTitle>
                <CardDescription>緊急備援月數是否足夠，分段給分。</CardDescription>
              </CardHeader>
              <CardContent>
                <ScoringBand
                  rows={[
                    { condition: "< 3 月", score: "25", tone: "danger" },
                    { condition: "3–6 月", score: "60", tone: "warning" },
                    { condition: "6–12 月", score: "85", tone: "success" },
                    { condition: "≥ 12 月", score: "100", tone: "success" },
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">DSR 打分規則</CardTitle>
                <CardDescription>債務壓力越輕，分數越高。</CardDescription>
              </CardHeader>
              <CardContent>
                <ScoringBand
                  rows={[
                    { condition: "> 35%", score: "20", tone: "danger" },
                    { condition: "20–35%", score: "50", tone: "warning" },
                    { condition: "10–20%", score: "75", tone: "warning" },
                    { condition: "< 10%", score: "95", tone: "success" },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* L2 */}
          <TabsContent value="l2" className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Layer 2 · 投資配置層</CardTitle>
                <CardDescription>
                  L2 = 0.30·分散 + 0.20·配置吻合 + 0.20·流動性 + 0.15·投入率 + 0.15·再平衡
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <TermCard
                  icon={PieChart}
                  tint="violet"
                  term="HHI 集中度指標"
                  english="Herfindahl-Hirschman Index"
                  plain="把每個持有部位的佔比平方後加總。全押一檔時 HHI = 1；越分散越接近 0。"
                  formula={
                    <Formula>
                      HHI = Σ wᵢ² ， wᵢ = 該部位市值 / 總市值
                    </Formula>
                  }
                  why="反壟斷局用它衡量產業集中度，也能直接衡量投資集中風險。比『買幾檔』更準。"
                />
                <TermCard
                  icon={Sparkles}
                  tint="violet"
                  term="分散度分數"
                  english="Diversification Score"
                  plain="把 HHI 翻轉成好懂的分數：越分散分數越高。"
                  formula={<Formula>Diversification = (1 − HHI) × 100</Formula>}
                />
                <TermCard
                  icon={Scale}
                  tint="amber"
                  term="風險資產比"
                  english="RAR"
                  plain="ETF、個股、加密、事業股權這類『可能大幅波動』的資產佔投資總額多少。"
                  formula={
                    <Formula>
                      RAR = (equity_etf + single_stock + crypto + business_equity) / 總投資
                    </Formula>
                  }
                />
                <TermCard
                  icon={Shield}
                  tint="amber"
                  term="人力資本修正"
                  english="HCA"
                  plain="你的本業收入是否跟股市 / 科技景氣連動？若高度連動，帳面風險資產比其實是低估了。"
                  formula={
                    <Formula>
                      labor correlation = high → HCA = 0.85
                      {"\n"}medium → 1.00 ，low → 1.10
                      {"\n"}RAR_adj = RAR × (1 / HCA)
                    </Formula>
                  }
                  why="工程師 + AI 產業本身就偏科技景氣風險，若再全押科技股，等於雙重曝險。HCA 幫你把『看不見的風險』也算進去。"
                />
                <TermCard
                  icon={PieChart}
                  tint="primary"
                  term="流動資產比"
                  english="LAR"
                  plain="能在數日內變現的資產（現金、活存、短期貨幣基金）佔投資總額的比例。"
                  formula={<Formula>LAR = 短期流動資產 / 總投資資產</Formula>}
                />
                <TermCard
                  icon={Rocket}
                  tint="primary"
                  term="投資覆蓋速度"
                  english="IAR"
                  plain="你每年主動投入投資的金額，佔你年收入的比例。不是報酬率，是『累積速度』。"
                  formula={<Formula>IAR = 年投入金額 / 年總收入</Formula>}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">配置吻合帶（預設規則）</CardTitle>
                <CardDescription>
                  不做預測報酬，只避免『工作高風險 + 投資高集中』的雙重暴露。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <RangeRow risk="low" hi="[0.30, 0.50]" lo="[0.40, 0.60]" />
                <RangeRow risk="medium" hi="[0.45, 0.65]" lo="[0.55, 0.75]" />
                <RangeRow risk="high" hi="[0.55, 0.75]" lo="[0.65, 0.85]" />
                <p className="pt-2 text-xs text-muted-foreground">
                  欄位解讀：左 = 風險承受度；中 = 本業與市場高度相關時的目標區；右 = 相關性低時的目標區。
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* L3 */}
          <TabsContent value="l3" className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Layer 3 · 現實收入生成層</CardTitle>
                <CardDescription>
                  引擎分 = 0.30·利潤 + 0.20·穩定 + 0.20·可擴張 + 0.15·自動化 + 0.15·護城河
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <TermCard
                  icon={PieChart}
                  tint="amber"
                  term="收入多樣性"
                  english="IDS"
                  plain="跟投資 HHI 一樣的邏輯：你的收入是否只靠單一雇主 / 單一專案。"
                  formula={<Formula>IDS = 1 − Σ pᵢ² ， pᵢ = 該收入 / 總收入</Formula>}
                  why="若 70% 以上來自單一雇主，被裁員就等於斷炊，系統會強制提高 L3 建構優先度。"
                />
                <TermCard
                  icon={Rocket}
                  tint="amber"
                  term="淨現金流"
                  english="NCF"
                  plain="單一收入引擎每月扣掉成本後真正進口袋的錢。"
                  formula={<Formula>NCFᵢ = 月營收 − 月成本</Formula>}
                />
                <TermCard
                  icon={Scale}
                  tint="violet"
                  term="時間槓桿比"
                  english="TLR"
                  plain="每投入 1 小時能產生多少淨現金流。工程師特別需要這個，不然只是換時薪。"
                  formula={<Formula>TLRᵢ = NCFᵢ / 每月工時</Formula>}
                />
                <TermCard
                  icon={Shield}
                  tint="rose"
                  term="擁有者依賴修正"
                  english="Owner-Adjusted NCF"
                  plain="越綁本人（你一不做就停）的引擎，真實價值要打折。"
                  formula={
                    <Formula>
                      OA_NCFᵢ = NCFᵢ × (1 − ownerDependencyScore/100 × 0.5)
                    </Formula>
                  }
                  why="防止把『只要我不做就沒收入』誤認成成熟資產。SaaS / 版稅這類低依賴的收入，加權後會領先接案。"
                />
                <TermCard
                  icon={ScrollText}
                  tint="primary"
                  term="引擎成熟度分數"
                  english="Engine Score"
                  plain="用五個子分數加權：利潤、穩定、可擴張、自動化、護城河。"
                  formula={
                    <Formula>
                      Engineᵢ = 0.30·利潤 + 0.20·穩定 + 0.20·可擴張
                      {"\n"}+ 0.15·自動化 + 0.15·護城河
                    </Formula>
                  }
                />
                <TermCard
                  icon={PieChart}
                  tint="primary"
                  term="L3 總分"
                  english="L3 Score"
                  plain="把每個引擎依 OA 淨流佔比加權，得到整層分數。"
                  formula={<Formula>L3 = Σ (wᵢ × Engineᵢ) ， wᵢ = OA_NCFᵢ / ΣOA_NCF</Formula>}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Target */}
          <TabsContent value="target" className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>目標層 · 選項能力</CardTitle>
                <CardDescription>
                  最終目標不是存到某個數字，而是讓你擁有『選擇權』：一人穩定、三人共同、跨國移動、半退休。
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <TermCard
                  icon={Target}
                  tint="primary"
                  term="目標資產（提領法）"
                  english="Required Assets"
                  plain="要讓資產在未來提供現金流，你目前需要多少總資產。分三段：進取、基準、保守。"
                  formula={
                    <Formula>
                      年支出 = 月支出 × 12
                      {"\n"}進取  = 年支出 / 0.040
                      {"\n"}基準  = 年支出 / 0.037
                      {"\n"}保守  = 年支出 / 0.035
                    </Formula>
                  }
                  why="4% 來自 Trinity / Bengen 歷史樣本；Morningstar 2024 將 30 年新退休者基準下修至 3.7%。系統預設用 3.7%，更保守用 3.5%。"
                />
                <TermCard
                  icon={Rocket}
                  tint="amber"
                  term="半主動收入調整"
                  english="Semi-Passive Adjusted"
                  plain="若你不完全退休、仍有 SaaS / 電商 / 顧問等半主動收入，需要的資產會更少。"
                  formula={
                    <Formula>
                      需求資產_調整 = (年支出 − 年半被動收入) / 提領率
                    </Formula>
                  }
                  why="符合你『不是停下來、而是保有選項』的真實人生設計。"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">三段提領率是什麼意思？</CardTitle>
                <CardDescription>同一年支出下，保守假設要求更大的本金。</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  <RateCard
                    rate="4.0%"
                    title="進取"
                    desc="Trinity / Bengen 歷史樣本的經典值，但在低利率與長退休期下可能偏樂觀。"
                    tone="rose"
                  />
                  <RateCard
                    rate="3.7%"
                    title="基準"
                    desc="Morningstar 2024 對新退休者 30 年期 90% 成功率的安全提領率。"
                    tone="amber"
                  />
                  <RateCard
                    rate="3.5%"
                    title="保守"
                    desc="若想保留更大安全邊際、或預期退休期超過 30 年，採用更低提領率。"
                    tone="emerald"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.section>

      {/* 演算法流程 */}
      <motion.section variants={item} className="space-y-5">
        <SectionHeader
          icon={Workflow}
          tint="amber"
          title="演算法主流程"
          subtitle="輸入你的財務資料後，系統做的事情。"
        />
        <Card>
          <CardContent className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-4">
            <FlowStep
              step="1"
              title="分層計算"
              detail="calcLayer1 / 2 / 3 各自輸出分數與細部指標（EFM、HHI、OA_NCF…）。"
            />
            <FlowStep
              step="2"
              title="加權總分"
              detail="Total = 0.4·L1 + 0.3·L2 + 0.3·L3，得到 0–100 的單一健康分數。"
            />
            <FlowStep
              step="3"
              title="目標缺口"
              detail="用三段提領率對照一人 / 三人 / 歐洲模式，算出離目標還差多少。"
            />
            <FlowStep
              step="4"
              title="規則引擎建議"
              detail="依缺口、債務、收入集中度，排出新增現金該先補哪一層、佔比多少。"
            />
          </CardContent>
        </Card>
      </motion.section>

      {/* 推薦規則 */}
      <motion.section variants={item} className="space-y-5">
        <SectionHeader
          icon={Lightbulb}
          tint="emerald"
          title="推薦規則（Rules of the Engine）"
          subtitle="系統用這些原則決定：你下一塊錢該往哪放。"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <RuleCard
            no="R1"
            title="EFM < 6 月 → 先補防禦"
            detail="新增可支配現金至少 60% 先進緊急金。流動性與金融福祉的關聯在 CFPB 研究中非常明確。"
          />
          <RuleCard
            no="R2"
            title="高利負債 > 長期合理報酬 → 先還債"
            detail="這是單純的財務數學：已知利率的負債 vs 預期報酬的投資，先殺掉穩賺的那一邊。"
          />
          <RuleCard
            no="R3"
            title="單一雇主 ≥ 70% 且有創業意圖 → 開第二引擎"
            detail="優先順序改為：補 L1 → 建 L3 第二引擎 → L2 常規定投。避免單點斷裂。"
          />
          <RuleCard
            no="R4"
            title="L3 引擎連續 6 個月正 NCF 且依賴下降 → 才加權重"
            detail="避免過早把不穩定的新引擎當成熟資產，造成配置錯位。"
          />
        </div>
      </motion.section>

      {/* 名詞速查表 */}
      <motion.section variants={item} className="space-y-5">
        <SectionHeader
          icon={BookOpen}
          tint="primary"
          title="縮寫速查表"
          subtitle="系統裡常見的英文縮寫，一次看懂。"
        />
        <Card>
          <CardContent className="grid gap-x-6 gap-y-3 p-6 md:grid-cols-2">
            <AbbrevRow abbr="EFM" full="Emergency Fund Months" zh="緊急備援月數" />
            <AbbrevRow abbr="ECR" full="Essential Coverage Ratio" zh="必要支出覆蓋率" />
            <AbbrevRow abbr="DSR" full="Debt Service Ratio" zh="債務服務比" />
            <AbbrevRow abbr="DCF" full="Dependents Coefficient" zh="扶養防禦係數" />
            <AbbrevRow abbr="HHI" full="Herfindahl-Hirschman Index" zh="集中度指標" />
            <AbbrevRow abbr="RAR" full="Risk Asset Ratio" zh="風險資產比" />
            <AbbrevRow abbr="HCA" full="Human Capital Adjustment" zh="人力資本修正係數" />
            <AbbrevRow abbr="LAR" full="Liquid Asset Ratio" zh="流動資產比" />
            <AbbrevRow abbr="IAR" full="Investment Accumulation Ratio" zh="投資覆蓋速度" />
            <AbbrevRow abbr="IDS" full="Income Diversification Score" zh="收入多樣性" />
            <AbbrevRow abbr="NCF" full="Net Cash Flow" zh="淨現金流" />
            <AbbrevRow abbr="TLR" full="Time Leverage Ratio" zh="時間槓桿比" />
            <AbbrevRow abbr="OA_NCF" full="Owner-Adjusted Net Cash Flow" zh="擁有者修正後淨流" />
            <AbbrevRow abbr="SWR" full="Safe Withdrawal Rate" zh="安全提領率" />
            <AbbrevRow abbr="FIRE" full="Financial Independence, Retire Early" zh="財務獨立、提早退休" />
            <AbbrevRow abbr="CoastFIRE" full="Coast FIRE" zh="滑行式財務獨立（不再加碼仍能退休）" />
          </CardContent>
        </Card>
      </motion.section>

      {/* 參考來源 */}
      <motion.section variants={item} className="space-y-5">
        <SectionHeader
          icon={ScrollText}
          tint="violet"
          title="理論參考來源"
          subtitle="系統背後主要引用的研究與方法論。"
        />
        <Card className="border-foreground/5 bg-foreground/[0.02]">
          <CardContent className="space-y-3 p-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">生命週期儲蓄與預防性儲蓄</span>
              ：年輕到中早期工作者的儲蓄包含明顯的預防性成分（NBER working papers on lifecycle saving & precautionary saving）。
            </p>
            <Separator className="bg-foreground/5" />
            <p>
              <span className="font-semibold text-foreground">人力資本與投資配置</span>
              ：勞動收入不可完全交易，會影響風險資產最適配置；年輕工作者的人力資本帶有『類股票』特性。Benzoni et al.、Roussanov 等 NBER 研究。
            </p>
            <Separator className="bg-foreground/5" />
            <p>
              <span className="font-semibold text-foreground">流動性與金融福祉</span>
              ：CFPB 指出較高的 liquid savings 與 financial well-being 強相關。
            </p>
            <Separator className="bg-foreground/5" />
            <p>
              <span className="font-semibold text-foreground">安全提領率</span>
              ：Bengen (1994)、Trinity Study (1998) 提出 4% 規則；Morningstar 2024 將 30 年新退休者基準下調至 3.7%。
            </p>
            <Separator className="bg-foreground/5" />
            <p>
              <span className="font-semibold text-foreground">集中度指標</span>
              ：HHI 原為反壟斷局衡量產業集中度的標準方法，直接可套用到投資組合與收入來源。
            </p>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  );
}

// --------- sub components ---------

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  tint,
}: {
  icon: typeof Shield;
  title: string;
  subtitle: string;
  tint: "primary" | "emerald" | "violet" | "amber" | "rose";
}) {
  const tintClass = {
    primary: "text-primary bg-primary/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    violet: "text-violet-500 bg-violet-500/10",
    amber: "text-amber-500 bg-amber-500/10",
    rose: "text-rose-500 bg-rose-500/10",
  }[tint];
  return (
    <div className="flex items-start gap-4">
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${tintClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function IdeaBlock({ no, title, text }: { no: string; title: string; text: string }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-foreground/[0.02] p-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
        Principle {no}
      </p>
      <h3 className="mt-2 text-base font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function LayerCard({
  layer,
  icon: Icon,
  title,
  question,
  pillars,
  weightLabel,
  tint,
}: {
  layer: string;
  icon: typeof Shield;
  title: string;
  question: string;
  pillars: string[];
  weightLabel: string;
  tint: "emerald" | "violet" | "amber";
}) {
  const tintClass = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    violet: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  }[tint];
  return (
    <div className="group flex h-full flex-col rounded-3xl border border-foreground/5 bg-foreground/[0.02] p-6 transition-all duration-300 hover:border-primary/20 hover:bg-foreground/[0.04]">
      <div className="flex items-center justify-between">
        <div className={`flex size-11 items-center justify-center rounded-2xl border ${tintClass}`}>
          <Icon size={20} />
        </div>
        <Badge
          variant="outline"
          className="rounded-full border-foreground/10 bg-foreground/[0.03] text-[10px] font-bold uppercase tracking-widest"
        >
          {layer}
        </Badge>
      </div>
      <h3 className="mt-5 text-lg font-black tracking-tight">{title}</h3>
      <p className="mt-1 text-sm italic text-muted-foreground">『{question}』</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {pillars.map((p) => (
          <li
            key={p}
            className="rounded-full border border-foreground/5 bg-foreground/[0.03] px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
          >
            {p}
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-foreground/5 pt-4 text-[11px] font-bold uppercase tracking-widest text-primary/80">
        {weightLabel}
      </p>
    </div>
  );
}

function RangeRow({ risk, hi, lo }: { risk: string; hi: string; lo: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr_1fr] items-center gap-3 rounded-lg border border-foreground/5 bg-foreground/[0.02] px-3 py-2">
      <Badge variant="outline" className="justify-self-start rounded-md font-mono uppercase">
        {risk}
      </Badge>
      <span className="font-mono text-xs tabular-nums text-muted-foreground">高相關 {hi}</span>
      <span className="font-mono text-xs tabular-nums text-muted-foreground">低相關 {lo}</span>
    </div>
  );
}

function RateCard({
  rate,
  title,
  desc,
  tone,
}: {
  rate: string;
  title: string;
  desc: string;
  tone: "rose" | "amber" | "emerald";
}) {
  const toneClass = {
    rose: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  }[tone];
  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="font-mono text-2xl font-black tracking-tighter tabular-nums">{rate}</p>
      <p className="mt-1 text-sm font-bold">{title}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

function FlowStep({ step, title, detail }: { step: string; title: string; detail: string }) {
  return (
    <div className="relative rounded-2xl border border-foreground/5 bg-foreground/[0.02] p-5">
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary/80">
        Step {step}
      </p>
      <h4 className="mt-2 text-base font-bold tracking-tight">{title}</h4>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

function RuleCard({ no, title, detail }: { no: string; title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-foreground/5 bg-foreground/[0.02] p-5">
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="rounded-md border-primary/20 bg-primary/10 font-mono text-[10px] font-bold text-primary"
        >
          {no}
        </Badge>
        <h4 className="text-sm font-bold tracking-tight">{title}</h4>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

function AbbrevRow({ abbr, full, zh }: { abbr: string; full: string; zh: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-foreground/[0.03]">
      <Badge
        variant="outline"
        className="shrink-0 rounded-md border-primary/20 bg-primary/10 font-mono text-[10px] font-bold text-primary"
      >
        {abbr}
      </Badge>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{zh}</p>
        <p className="text-[11px] text-muted-foreground">{full}</p>
      </div>
    </div>
  );
}
