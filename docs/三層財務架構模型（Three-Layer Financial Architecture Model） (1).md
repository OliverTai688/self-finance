下面我把你的三層財務設計，重構成一個可直接落地成「資料模型 \+ 計算規則 \+ 輸出儀表板」的版本。這個版本不是一般理財文章，而是偏向「個人財務決策系統」：你輸入現在的收入、資產、支出、投資、創收專案，就能自動算出三層財務健康度、缺口、優先順序與下一步配置。整體理論基礎我用四個主軸支撐：生命週期儲蓄／預防性儲蓄、流動性與金融韌性、勞動收入風險與資產配置、人生成本覆蓋與退休提領。([NBER](https://www.nber.org/system/files/working_papers/w7271/w7271.pdf))

先講核心結論。以你的情境來看，你不是單純的「投資人」，而是同時具有薪資收入、接案收入、未來產品化收入潛力的人力資本型工作者。這種人最不適合直接用傳統單一投資帳戶思維管理財務，而應該拆成三個系統：第一層處理流動性、抗風險與生活穩定；第二層處理風險資產配置與資產成長；第三層處理可擴張的現實收入引擎。這樣做的原因在研究上是合理的：生命週期模型指出，年輕到中早期工作者的儲蓄包含明顯的預防性儲蓄成分；同時，勞動收入與人力資本不是可完全交易的資產，因此會影響風險資產的最適配置。([NBER](https://www.nber.org/system/files/working_papers/w7271/w7271.pdf))

---

## **一、系統總架構**

我建議你的系統輸出三種東西：

1. **層級分數**：第一層、第二層、第三層各自 0–100 分  
2. **缺口指標**：哪些地方不足，例如緊急金、保險覆蓋、投資集中、收入過度單一  
3. **配置建議**：每月新增現金流應該先補哪一層、補多少

整體可以表示成：

$$  
\\text{Total Financial Architecture Score}  
\= w\_1 L\_1 \+ w\_2 L\_2 \+ w\_3 L\_3  
$$

其中：

* (L\_1) \= 個人財務防禦層分數  
* (L\_2) \= 投資配置層分數  
* (L\_3) \= 現實收入生成層分數

若你現階段仍以正職 \+ 接案為主，我會先用：  
$$  
w\_1 \= 0.40,\\quad w\_2 \= 0.30,\\quad w\_3 \= 0.30  
$$  
因為對於仍在累積期、而且有收入波動的人，流動性與韌性通常比激進成長更優先。這個設定和 CFPB 對流動性、液態儲蓄與金融福祉的研究方向一致，也和 buffer-stock / precautionary saving 的文獻一致。([NBER](https://www.nber.org/system/files/working_papers/w7271/w7271.pdf))

---

## **二、第一層：個人財務防禦層（Personal Finance Layer）**

### **理論依據**

CFPB 的研究顯示，較高的 liquid savings 與更高的 financial well-being 強烈相關；他們也指出，能否在 30 天內籌出 2,000 美元，和金融福祉差異很大。NBER 關於 financial fragility 的研究也把「短期應急能力」視為家庭脆弱性的核心衡量之一。

### **你這層要追蹤的維度**

這層不是只看「存款很多嗎」，而是至少看六個面向：

* 流動性安全  
* 固定支出壓力  
* 收入穩定性  
* 高成本負債壓力  
* 基本保險覆蓋  
* 中長期轉化準備度

### **第一層 Schema**

type PersonalFinanceLayer \= {  
  monthly\_income\_fixed: number          // 正職固定月收入  
  monthly\_income\_variable\_avg\_12m: number // 接案/兼職12月平均  
  monthly\_essential\_expense: number     // 房租、保費、飲食、交通、孝親等必要支出  
  monthly\_nonessential\_expense: number  // 非必要支出  
  emergency\_fund\_cash: number           // 現金/活存/高流動貨幣基金  
  high\_interest\_debt\_balance: number    // 信用卡循環、信貸等高利負債  
  debt\_monthly\_payment: number  
  insurance\_coverage\_score: number      // 0-100, 手動評估  
  dependents\_count: number              // 需供應人口數  
  target\_lifestyle\_monthly\_cost: number // 你期待未來想維持的生活成本  
  relocation\_goal\_years: number | null  // 幾年內想移民/換城市  
}

### **第一層核心指標與公式**

#### **1\. 緊急備援月數**

**$$**  
**EFM \= \\frac{\\text{emergency\_fund\_cash}}{\\text{monthly\_essential\_expense}}**  
**$$**

分數規則：

* \< 3 月：25 分  
* 3–6 月：60 分  
* 6–12 月：85 分  
* 12 月：100 分

雖然坊間常見 3–6 個月，但更重要的是「流動性真的存在且可立即動用」。這點和 CFPB 關於 liquid savings 與 financial well-being 的證據一致。

#### **2\. 必要支出覆蓋率**

**$$**  
**ECR \= \\frac{\\text{monthly\_income\_fixed} \+ 0.7 \\times \\text{monthly\_income\_variable\_avg\_12m}}{\\text{monthly\_essential\_expense}}**  
**$$**

我故意只把變動收入打七折，是因為變動收入的可持續性不如正職現金流。這不是論文中的固定係數，而是實務風險折減參數，用來避免你高估接案能力。若要更嚴格，可改成 0.5。這樣的處理邏輯符合勞動收入不確定性會影響儲蓄與風險承擔的文獻方向。([NBER](https://www.nber.org/system/files/working_papers/w7271/w7271.pdf))

#### **3\. 債務壓力比**

**$$**  
**DSR \= \\frac{\\text{debt\_monthly\_payment}}{\\text{monthly\_income\_fixed} \+ \\text{monthly\_income\_variable\_avg\_12m}}**  
**$$**

建議分數：

* 35%：20 分  
* 20–35%：50 分  
* 10–20%：75 分  
* \< 10%：95 分

#### **4\. 家庭/扶養防禦係數**

**$$**  
**DCF \= 1 \+ 0.15 \\times \\text{dependents\_count}**  
**$$**

用途不是加分，而是提高第一層要求門檻。你若希望未來支撐三人生活，緊急金與現金流要求就不應再用單人標準。這是你的系統需要比一般理財表格更進一步的地方。

### **第一層綜合分數**

**$$**  
**L\_1 \= 0.35S\_{EFM} \+ 0.25S\_{ECR} \+ 0.15S\_{DSR} \+ 0.10S\_{Insurance} \+ 0.15S\_{Liquidity\\ Stability}**  
**$$**

其中 (S\_{Liquidity\\ Stability}) 可由「固定收入占總收入比」計算：  
$$  
IncomeStability \= \\frac{\\text{monthly\_income\_fixed}}{\\text{monthly\_income\_fixed}+\\text{monthly\_income\_variable\_avg\_12m}}  
$$

---

## **三、第二層：投資配置層（Investment Layer）**

### **理論依據**

生命週期投資與 household finance 文獻指出，投資配置不能只看年齡，也要看人力資本特性、勞動收入風險與其和股市的關聯。Benzoni 等研究指出，人力資本在生命前半段具有較強的「類股票特性」；Roussanov 也指出，當年輕人仍有大量需投入的人力資本選項時，流動性限制可能會壓低風險資產配置。換句話說，你不能直接套「年輕就該超高股票比例」這種簡化版規則。([NBER](https://www.nber.org/system/files/working_papers/w11247/w11247.pdf))

### **第二層 Schema**

type InvestmentItem \= {  
  name: string  
  category: "cash" | "bond" | "equity\_etf" | "single\_stock" | "crypto" | "business\_equity" | "other"  
  market\_value: number  
  monthly\_contribution: number  
  expected\_return\_annual?: number  
  expected\_volatility\_annual?: number  
  liquidity\_level: 1 | 2 | 3 | 4 | 5  
  concentration\_risk\_level: 1 | 2 | 3 | 4 | 5  
}

type InvestmentLayer \= {  
  items: InvestmentItem$$$$  
  rebalancing\_frequency\_months: number  
  max\_single\_position\_ratio\_target: number  
  risk\_tolerance: "low" | "medium" | "high"  
  labor\_income\_correlation\_to\_market: "low" | "medium" | "high"  
  investable\_assets\_total: number  
}

### **第二層核心指標與公式**

#### **1\. 流動資產占比**

$$  
LAR \= \\frac{\\text{cash \+ short-term liquid assets}}{\\text{total investable assets}}  
$$

用途：避免你把所有資產都鎖在波動性或低流動性的標的裡。

#### **2\. 集中度指標（Herfindahl-Hirschman Index）**

$$  
HHI \= \\sum\_{i=1}^{n} w\_i^2  
$$

其中 (w\_i) 是各資產部位占比。  
若全壓單一標的，HHI \= 1；越分散越低。這比單純算「買幾檔」更好。

可轉為分數：  
$$  
S\_{diversification} \= 100 \\times (1 \- HHI)  
$$

#### **3\. 風險資產比率**

$$  
RAR \= \\frac{\\text{equity\_etf \+ single\_stock \+ crypto \+ business\_equity}}{\\text{total investable assets}}  
$$

但這個比率不能單獨看，必須乘上「人力資本修正項」。

#### **4\. 人力資本風險修正項**

若你的工作收入與景氣、科技股、AI 市場高度連動，你的總風險曝險其實比帳面股票配置更高。可設：

$$  
HCA \=  
\\begin{cases}  
0.85, & \\text{labor correlation \= high}\\  
1.00, & \\text{medium}\\  
1.10, & \\text{low}  
\\end{cases}  
$$

然後算「修正後建議風險資產比」：  
$$  
RAR\_{adj} \= RAR \\times \\frac{1}{HCA}  
$$

這個概念直接來自勞動收入風險與人力資本影響最適投資配置的研究。對你這種工程師＋可能做 AI / SaaS 的人，這個修正非常重要，因為你的職涯本身就已經偏向科技景氣風險。([NBER](https://www.nber.org/system/files/working_papers/w11247/w11247.pdf))

#### **5\. 投資覆蓋速度**

$$  
IAR \= \\frac{\\text{annual contributions to investments}}{\\text{annual gross income}}  
$$

這不是報酬率，而是資產累積速度。

### **第二層綜合分數**

$$  
L\_2 \= 0.30S\_{diversification}

* 0.20S\_{allocation\\ fit}  
* 0.20S\_{liquidity}  
* 0.15S\_{contribution\\ rate}  
* 0.15S\_{rebalancing\\ discipline}  
  $$

其中 (S\_{allocation\\ fit}) 可以這樣定義：

* 先依風險承受度與職涯風險給一個建議風險資產帶  
* 再看目前配置離目標帶距離多少

例如你的預設規則可寫成：

function targetRiskAssetRange(  
  riskTolerance: "low" | "medium" | "high",  
  laborIncomeCorrelation: "low" | "medium" | "high"  
) {  
  if (riskTolerance \=== "low") {  
    return laborIncomeCorrelation \=== "high" ? $$0.30, 0.50$$ : $$0.40, 0.60$$  
  }  
  if (riskTolerance \=== "medium") {  
    return laborIncomeCorrelation \=== "high" ? $$0.45, 0.65$$ : $$0.55, 0.75$$  
  }  
  return laborIncomeCorrelation \=== "high" ? $$0.55, 0.75$$ : $$0.65, 0.85$$  
}

這裡不是在預測報酬，而是在避免你「工作已高風險、投資再高集中」的雙重暴露。([NBER](https://www.nber.org/system/files/working_papers/w11247/w11247.pdf))

---

## **四、第三層：現實收入生成層（Income Generation Layer）**

### **理論與實務定位**

這一層其實最符合你的真實人生路徑。你不是只想退休，而是想保有地理移動、創業、供應家人、甚至移民的選擇權。這種狀況下，真正重要的不只是資本市場投資，而是你是否能把技能、人脈、產品、品牌轉成多引擎收入。微型創業與自營收入研究常把收入多樣化與消費/儲蓄增強視為重要功能，但這層風險比 ETF 高，因此需要和第一層嚴格切分。([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0305750X15000923?utm_source=chatgpt.com))

### **第三層 Schema**

type IncomeEngine \= {  
  name: string  
  type: "salary" | "freelance" | "ecommerce" | "saas" | "course" | "consulting" | "other"  
  monthly\_revenue\_avg\_6m: number  
  monthly\_cost\_avg\_6m: number  
  monthly\_hours\_avg\_6m: number  
  growth\_rate\_6m: number           // ex: 0.12 \= \+12%  
  volatility\_6m: number            // revenue std / mean  
  owner\_dependency\_score: number   // 0-100, 越高代表越綁本人  
  scalability\_score: number        // 0-100  
  moat\_score: number               // 0-100  
  automation\_score: number         // 0-100  
}

type IncomeGenerationLayer \= {  
  engines: IncomeEngine$$$$  
  target\_people\_supported: number  
  target\_geo\_mode: "taiwan" | "dual\_country" | "europe"  
  target\_financial\_independence\_years: number  
}

### **第三層核心指標與公式**

#### **1\. 收入來源多樣性**

$$  
IDS \= 1 \- \\sum p\_i^2  
$$  
其中 (p\_i) 是每個收入來源占總收入比例。  
這和投資集中度概念相同。來源越多元，單點斷裂風險越低。

#### **2\. 引擎淨現金流**

$$  
NCF\_i \= \\text{monthly revenue avg} \- \\text{monthly cost avg}  
$$

#### **3\. 時間槓桿比**

$$  
TLR\_i \= \\frac{NCF\_i}{\\text{monthly hours avg}}  
$$

你是工程師，所以不要只看營收，要看「每投入 1 小時帶來多少淨現金流」。

#### **4\. 擁有者依賴修正後收入**

$$  
ONCF\_i \= NCF\_i \\times (1 \- ownerDependencyScore/100 \\times 0.5)  
$$

這是為了防止你把「只要我不做就沒有收入」誤認成成熟資產。

#### **5\. 收入層成熟度分數**

$$  
EngineScore\_i \= 0.30S\_{profitability}

* 0.20S\_{stability}  
* 0.20S\_{scalability}  
* 0.15S\_{automation}  
* 0.15S\_{moat}  
  $$

第三層總分：  
$$  
L\_3 \= \\sum (w\_i \\times EngineScore\_i)  
$$  
其中 (w\_i) 依各收入引擎的 ONCF 占比決定。

---

## **五、目標層：你真正想達成的「選項能力」**

你最後的目標不是只有存到多少，而是要知道你是否具備這些選項：

* 一人穩定生活  
* 三人共同生活供應  
* 可跨國移動  
* 可半退休 / 自在創業  
* 可移民歐洲後仍不失速

因此系統應再加一個輸出模組：

type FinancialOptionTargets \= {  
  monthly\_cost\_single: number  
  monthly\_cost\_three\_people: number  
  monthly\_cost\_europe\_mode: number  
  coast\_fire\_required\_assets: number  
  lean\_fire\_required\_assets: number  
  business\_runway\_months\_required: number  
}

### **目標資產需求公式**

如果你要算「純資產提領模式」的基線，可用：

$$  
RequiredAssets \= \\frac{AnnualTargetSpending}{WithdrawalRate}  
$$

4% 規則來自 Bengen / Trinity 系列文獻，但它本質上是歷史樣本中的提領經驗法則，不是保證。Financial Planning Association 2015 的整理指出，Trinity Study 的 4% 是在特定歷史期間、特定股債組合下得到的結果；Morningstar 2024 則把 30 年退休期的新退休者基準 safe withdrawal rate 估為 3.7%。因此，若你想把系統做得較保守，我會建議預設 3.5%–3.7%，而不是固定 4%。([Financial Planning Association](https://www.financialplanningassociation.org/article/journal/AUG15-sustainable-retirement-spending-low-interest-rates-updating-trinity-study))

所以你可做三段計算：

$$  
Assets\_{aggressive} \= \\frac{AnnualSpend}{0.04}  
$$  
$$  
Assets\_{base} \= \\frac{AnnualSpend}{0.037}  
$$  
$$  
Assets\_{conservative} \= \\frac{AnnualSpend}{0.035}  
$$

如果未來你不是完全退休，而是保留 SaaS / 電商 / 顧問等半主動收入，那就可以改算：

$$  
RequiredAssetsAdjusted \=  
\\frac{AnnualSpend \- AnnualSemiPassiveIncome}{WithdrawalRate}  
$$

這會更符合你的實際人生設計。([晨星](https://www.morningstar.com/retirement/whats-safe-retirement-spending-rate-2025?utm_source=chatgpt.com))

---

## **六、你可以直接用的總 Schema**

下面這個結構，已經可以拿去做資料庫或前端表單。

type FinancialSystemInput \= {  
  profile: {  
    age: number  
    occupation: string  
    country: string  
    dependents\_count: number  
    target\_people\_supported: number  
    target\_geo\_mode: "taiwan" | "dual\_country" | "europe"  
  }

  personal\_finance: PersonalFinanceLayer  
  investment: InvestmentLayer  
  income\_generation: IncomeGenerationLayer

  goals: {  
    target\_retirement\_age?: number  
    target\_migration\_year?: number  
    target\_business\_launch\_year?: number  
    target\_monthly\_cost\_now: number  
    target\_monthly\_cost\_3people: number  
    target\_monthly\_cost\_europe: number  
  }  
}

輸出：

type FinancialSystemOutput \= {  
  scores: {  
    layer1\_defense: number  
    layer2\_investment: number  
    layer3\_income\_generation: number  
    total: number  
  }

  diagnostics: {  
    emergency\_fund\_months: number  
    debt\_service\_ratio: number  
    income\_stability\_ratio: number  
    diversification\_hhi: number  
    risk\_asset\_ratio: number  
    income\_diversification\_score: number  
    owner\_adjusted\_income\_total: number  
  }

  target\_analysis: {  
    required\_assets\_aggressive: number  
    required\_assets\_base: number  
    required\_assets\_conservative: number  
    funding\_gap\_taiwan\_mode: number  
    funding\_gap\_three\_people\_mode: number  
    funding\_gap\_europe\_mode: number  
  }

  recommendations: string$$$$  
}

---

## **七、演算法主流程**

function evaluateFinancialArchitecture(input: FinancialSystemInput): FinancialSystemOutput {  
  const layer1 \= calcLayer1(input.personal\_finance)  
  const layer2 \= calcLayer2(input.investment, input.profile.occupation)  
  const layer3 \= calcLayer3(input.income\_generation)

  const total \=  
    layer1.score \* 0.4 \+  
    layer2.score \* 0.3 \+  
    layer3.score \* 0.3

  const targets \= calcTargetAnalysis(input)

  const recommendations \= generateRecommendations({  
    layer1,  
    layer2,  
    layer3,  
    targets  
  })

  return {  
    scores: {  
      layer1\_defense: layer1.score,  
      layer2\_investment: layer2.score,  
      layer3\_income\_generation: layer3.score,  
      total  
    },  
    diagnostics: {  
      emergency\_fund\_months: layer1.emergencyFundMonths,  
      debt\_service\_ratio: layer1.debtServiceRatio,  
      income\_stability\_ratio: layer1.incomeStabilityRatio,  
      diversification\_hhi: layer2.hhi,  
      risk\_asset\_ratio: layer2.riskAssetRatio,  
      income\_diversification\_score: layer3.incomeDiversificationScore,  
      owner\_adjusted\_income\_total: layer3.ownerAdjustedIncomeTotal  
    },  
    target\_analysis: targets,  
    recommendations  
  }  
}

---

## **八、推薦規則引擎**

這裡最重要的是「先補缺口，再談進攻」。

### **Rule 1**

若  
$$  
EFM \< 6  
$$  
則所有新增可支配現金的 60% 先補第一層，不先擴大高風險投資或新創業支出。這是因為流動性與金融福祉、抗脆弱性高度相關。

### **Rule 2**

若高利負債存在，且利率顯著高於長期投資合理預期報酬，優先還債而非加碼風險資產。這是一般財務數學的直接比較，不依賴近期市場預測。

### **Rule 3**

若收入來源 70% 以上來自單一雇主，且你有明顯創業意圖，則新增現金配置優先順序應改為：

1. 第一層補足  
2. 第三層建立第二引擎  
3. 第二層常規定投

### **Rule 4**

若第三層已有至少一個引擎連續 6 個月為正淨現金流，且 owner dependency 持續下降，才提高第三層再投資權重。

---

## **九、給你的預設決策參數**

依你目前的職涯型態，我會先給這組預設值：

const defaultPolicy \= {  
  emergencyFundTargetMonths: 9,  
  debtServiceRatioWarning: 0.25,  
  maxSinglePositionRatioTarget: 0.20,  
  targetInvestmentContributionRatio: 0.20,  
  targetIncomeEngineCount: 3,  
  withdrawalRateBase: 0.037,  
  withdrawalRateConservative: 0.035  
}

理由是：

* 你有正職，但未來想創業／移動／支撐多人生活，備援月數不能只抓 3–6 個月。  
* 你的人力資本偏科技與創業導向，投資與職涯風險可能同向，不宜太集中。  
* 你的最終目標是 option-rich life，不是單純存退休金。Morningstar 2024 對新退休者 30 年期的 3.7% 基準，也支持你在長期規劃時用比 4% 更保守的基線。([晨星](https://www.morningstar.com/retirement/whats-safe-retirement-spending-rate-2025?utm_source=chatgpt.com))

---

## **十、你下一步最適合怎麼做**

最好的做法不是立刻討論買哪檔，而是先把你的系統資料輸入欄位定義好。你只要先收集這些數字，就可以跑出第一版：

* 固定月收入  
* 變動月收入 12 月平均  
* 必要支出  
* 非必要支出  
* 緊急金  
* 高利負債  
* 現有投資部位與市值  
* 每個收入引擎近 6 個月營收、成本、工時  
* 你想支撐 1 人 / 3 人 / 歐洲模式的月生活費

有了這批資料，這套 schema 就能輸出：

* 你現在是哪一層最弱  
* 新增 1 元現金流應該先補哪裡  
* 你的 FIRE / 半退休 / 移民 / 創業目標各自差多少  
* 你目前是「防禦不足型」、「投資失衡型」還是「收入引擎未成熟型」

若你要，我下一步可以直接幫你把這套東西寫成 **Prisma schema \+ TypeScript 計算函式 \+ JSON 範例資料**，讓你可以直接放進你的 Personal OS 或財務 dashboard。

