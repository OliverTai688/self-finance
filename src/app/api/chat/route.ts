import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export const maxDuration = 30;

type ChatContext = {
  profile?: unknown;
  evaluation?: unknown;
  pathname?: string;
};

const PAGE_HINTS: Record<string, string> = {
  "/": "使用者正在查看 Dashboard（三層總覽）。優先用總分、L1/L2/L3 分數與原型回答。",
  "/inputs": "使用者正在填寫或編輯財務資料。回答時協助他釐清欄位的意義與合理範圍。",
  "/report": "使用者正在看詳細報告。可直接引用子分數、HHI、提領率對照。",
  "/glossary": "使用者正在查閱名詞與公式解釋。可深入說明定義、推導與背後研究。",
  "/settings": "使用者正在調整設定。避免給投資建議，專注幫他設定系統。",
};

export async function POST(req: Request) {
  const { messages, context }: { messages: UIMessage[]; context?: ChatContext } =
    await req.json();

  const pathname = context?.pathname ?? "/";
  const pageHint = PAGE_HINTS[pathname] ?? "";

  const systemPrompt = `你是 Self Finance 系統內建的財務助手，專精於「三層財務架構」。
你的目標是依據使用者的即時財務資料，給出精確、可執行、個人化的建議。

三層架構：
1. L1 個人財務防禦層：緊急金(EFM)、必要支出覆蓋率(ECR)、債務服務比(DSR)、保險、收入穩定度。權重 0.40。
2. L2 投資配置層：HHI 分散度、風險資產比、人力資本修正(HCA)、流動性、投入速度。權重 0.30。
3. L3 現實收入生成層：收入多樣性(IDS)、淨現金流(NCF)、時間槓桿(TLR)、擁有者依賴修正(OA)、護城河與自動化。權重 0.30。

目標提領率：進取 4% / 基準 3.7%（Morningstar 2024）/ 保守 3.5%。

當前頁面：${pathname}
${pageHint}

使用者財務資料（JSON）：
${JSON.stringify(context ?? {}, null, 2)}

回答守則：
- 一律繁體中文，口吻專業、簡潔、溫暖。
- 先引用資料再給建議，說出「為什麼」；避免泛泛而談。
- 當使用者問『我該先補哪一層 / 要不要買 X / 離目標還差多少』時，優先依現有 L1-L3 分數與缺口給排序。
- 若資料不足，直接說缺什麼欄位；不要憑空猜測。
- 所有結論末尾加一句：此為系統輔助分析，非專業投資建議。`;

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? "gpt-4o"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      if (error instanceof Error) return error.message;
      if (typeof error === "string") return error;
      return "AI 服務暫時無法使用，請稍後再試。";
    },
  });
}
