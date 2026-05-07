# **📘 Financial Architecture System — Implementation Spec**

---

# **一、Prisma Schema（資料模型）**

// \========================  
// Core User Profile  
// \========================  
model User {  
  id              String   @id @default(cuid())  
  name            String?  
  age             Int  
  occupation      String  
  country         String  
  dependentsCount Int

  createdAt       DateTime @default(now())  
  updatedAt       DateTime @updatedAt

  financialProfile FinancialProfile?  
}

// \========================  
// Financial Profile (Root)  
// \========================  
model FinancialProfile {  
  id        String   @id @default(cuid())  
  userId    String   @unique  
  user      User     @relation(fields: \[userId\], references: \[id\])

  // Targets  
  targetMonthlyCostSingle     Float  
  targetMonthlyCostThree      Float  
  targetMonthlyCostEurope     Float

  personalFinance PersonalFinanceLayer?  
  investments     InvestmentItem\[\]  
  incomeEngines   IncomeEngine\[\]

  createdAt DateTime @default(now())  
  updatedAt DateTime @updatedAt  
}

// \========================  
// Layer 1: Personal Finance  
// \========================  
model PersonalFinanceLayer {  
  id                        String   @id @default(cuid())  
  profileId                 String   @unique  
  profile                   FinancialProfile @relation(fields: \[profileId\], references: \[id\])

  monthlyIncomeFixed        Float  
  monthlyIncomeVariableAvg  Float

  monthlyEssentialExpense   Float  
  monthlyNonEssentialExpense Float

  emergencyFundCash         Float

  highInterestDebt          Float  
  debtMonthlyPayment        Float

  insuranceScore            Float // 0-100 manually

  createdAt DateTime @default(now())  
}

// \========================  
// Layer 2: Investments  
// \========================  
model InvestmentItem {  
  id            String   @id @default(cuid())  
  profileId     String  
  profile       FinancialProfile @relation(fields: \[profileId\], references: \[id\])

  name          String  
  category      String // cash, etf, stock, crypto, business

  marketValue   Float  
  monthlyContribution Float

  liquidityLevel Int // 1-5  
  concentrationRiskLevel Int // 1-5

  createdAt DateTime @default(now())  
}

// \========================  
// Layer 3: Income Engines  
// \========================  
model IncomeEngine {  
  id            String   @id @default(cuid())  
  profileId     String  
  profile       FinancialProfile @relation(fields: \[profileId\], references: \[id\])

  name          String  
  type          String // salary, freelance, saas, ecommerce

  monthlyRevenue Float  
  monthlyCost    Float  
  monthlyHours   Float

  growthRate     Float  
  volatility     Float

  ownerDependencyScore Float // 0-100  
  scalabilityScore     Float  
  automationScore      Float  
  moatScore            Float

  createdAt DateTime @default(now())  
}

---

# **二、TypeScript 計算引擎**

這裡是你系統的「核心價值」，所有決策都從這裡產生。

---

## **1️⃣ Layer 1：防禦層**

export function calcLayer1(data: PersonalFinanceLayer) {  
  const {  
    monthlyIncomeFixed,  
    monthlyIncomeVariableAvg,  
    monthlyEssentialExpense,  
    emergencyFundCash,  
    debtMonthlyPayment,  
    insuranceScore  
  } \= data

  // 緊急金月數  
  const emergencyFundMonths \=  
    emergencyFundCash / monthlyEssentialExpense

  // 收入覆蓋率（變動收入打7折）  
  const coverageRatio \=  
    (monthlyIncomeFixed \+ monthlyIncomeVariableAvg \* 0.7) /  
    monthlyEssentialExpense

  // 債務比  
  const debtRatio \=  
    debtMonthlyPayment /  
    (monthlyIncomeFixed \+ monthlyIncomeVariableAvg)

  // 分數計算  
  const scoreEF \=  
    emergencyFundMonths \< 3 ? 25 :  
    emergencyFundMonths \< 6 ? 60 :  
    emergencyFundMonths \< 12 ? 85 : 100

  const scoreCoverage \=  
    coverageRatio \< 1 ? 30 :  
    coverageRatio \< 1.5 ? 60 :  
    coverageRatio \< 2 ? 80 : 95

  const scoreDebt \=  
    debtRatio \> 0.35 ? 20 :  
    debtRatio \> 0.2 ? 50 :  
    debtRatio \> 0.1 ? 75 : 95

  const totalScore \=  
    scoreEF \* 0.35 \+  
    scoreCoverage \* 0.25 \+  
    scoreDebt \* 0.15 \+  
    insuranceScore \* 0.25

  return {  
    score: totalScore,  
    emergencyFundMonths,  
    coverageRatio,  
    debtRatio  
  }  
}

---

## **2️⃣ Layer 2：投資層**

export function calcLayer2(items: InvestmentItem\[\]) {  
  const total \= items.reduce((sum, i) \=\> sum \+ i.marketValue, 0\)

  const weights \= items.map(i \=\> i.marketValue / total)

  // HHI 分散度  
  const hhi \= weights.reduce((sum, w) \=\> sum \+ w \* w, 0\)  
  const diversificationScore \= (1 \- hhi) \* 100

  // 風險資產  
  const riskAssets \= items  
    .filter(i \=\> \["etf", "stock", "crypto"\].includes(i.category))  
    .reduce((sum, i) \=\> sum \+ i.marketValue, 0\)

  const riskRatio \= riskAssets / total

  const riskScore \=  
    riskRatio \< 0.3 ? 50 :  
    riskRatio \< 0.6 ? 80 : 90

  const totalScore \=  
    diversificationScore \* 0.5 \+  
    riskScore \* 0.5

  return {  
    score: totalScore,  
    hhi,  
    diversificationScore,  
    riskRatio  
  }  
}

---

## **3️⃣ Layer 3：收入層**

export function calcLayer3(engines: IncomeEngine\[\]) {  
  const totalRevenue \= engines.reduce(  
    (sum, e) \=\> sum \+ e.monthlyRevenue, 0  
  )

  const incomeShares \= engines.map(  
    e \=\> e.monthlyRevenue / totalRevenue  
  )

  // 收入集中度  
  const hhi \= incomeShares.reduce((s, p) \=\> s \+ p \* p, 0\)  
  const diversificationScore \= (1 \- hhi) \* 100

  const engineScores \= engines.map(e \=\> {  
    const profit \= e.monthlyRevenue \- e.monthlyCost

    const adjusted \=  
      profit \* (1 \- e.ownerDependencyScore / 100 \* 0.5)

    const score \=  
      adjusted \* 0.3 \+  
      (100 \- e.volatility \* 100\) \* 0.2 \+  
      e.scalabilityScore \* 0.2 \+  
      e.automationScore \* 0.15 \+  
      e.moatScore \* 0.15

    return score  
  })

  const avgScore \=  
    engineScores.reduce((s, x) \=\> s \+ x, 0\) / engineScores.length

  return {  
    score: avgScore,  
    diversificationScore  
  }  
}

---

## **4️⃣ 總評分**

export function calcTotal(layer1, layer2, layer3) {  
  return (  
    layer1.score \* 0.4 \+  
    layer2.score \* 0.3 \+  
    layer3.score \* 0.3  
  )  
}

---

## **5️⃣ 目標資產計算（核心）**

export function calcTargetAssets(monthlyCost: number) {  
  const annual \= monthlyCost \* 12

  return {  
    aggressive: annual / 0.04,  
    base: annual / 0.037,  
    conservative: annual / 0.035  
  }  
}

---

# **三、JSON 範例資料（你的情境）**

{  
  "user": {  
    "age": 27,  
    "occupation": "Full-stack engineer",  
    "dependentsCount": 0  
  },  
  "financialProfile": {  
    "targetMonthlyCostSingle": 30000,  
    "targetMonthlyCostThree": 90000,  
    "targetMonthlyCostEurope": 120000  
  },  
  "personalFinance": {  
    "monthlyIncomeFixed": 60000,  
    "monthlyIncomeVariableAvg": 20000,  
    "monthlyEssentialExpense": 30000,  
    "monthlyNonEssentialExpense": 10000,  
    "emergencyFundCash": 500000,  
    "highInterestDebt": 0,  
    "debtMonthlyPayment": 0,  
    "insuranceScore": 70  
  },  
  "investments": \[  
    {  
      "name": "0050 ETF",  
      "category": "etf",  
      "marketValue": 300000,  
      "monthlyContribution": 10000  
    },  
    {  
      "name": "Cash",  
      "category": "cash",  
      "marketValue": 200000,  
      "monthlyContribution": 0  
    }  
  \],  
  "incomeEngines": \[  
    {  
      "name": "Full-time Job",  
      "type": "salary",  
      "monthlyRevenue": 60000,  
      "monthlyCost": 0,  
      "monthlyHours": 160,  
      "growthRate": 0.02,  
      "volatility": 0.05,  
      "ownerDependencyScore": 100,  
      "scalabilityScore": 20,  
      "automationScore": 10,  
      "moatScore": 40  
    },  
    {  
      "name": "Freelance",  
      "type": "freelance",  
      "monthlyRevenue": 20000,  
      "monthlyCost": 2000,  
      "monthlyHours": 40,  
      "growthRate": 0.1,  
      "volatility": 0.3,  
      "ownerDependencyScore": 90,  
      "scalabilityScore": 40,  
      "automationScore": 20,  
      "moatScore": 50  
    }  
  \]  
}

---

# **四、這套系統真正的價值**

這不是「理財工具」，而是：

### **👉 你的決策作業系統**

它會讓你每個月都能回答：

* 我要先補緊急金？還是投資？  
* 我該不該開新的收入專案？  
* 我現在離「三人生活」還差多少？  
* 我現在是「風險太高」還是「成長太慢」？

---

