// ─── Mock Asset Records ───────────────────────────────────────────────────────
export const assetDatabase = {
  ASSET_1: {
    agmtId: 'ASSET_1', custAge: 29, custGender: 'F', custCibil: -1,
    employment: 'NREGI', salary: 30000, coborrower: 'N',
    appScoreRisk: 'LOW RISK', assetModel: 'MOPEDS', assetFuel: 'PETROL',
    loanAmount: 68712, ltv: 85.2, osBalance: 47890,
    assetHealthIndex: 100.0, recoveryEfficiency: 78.83,
    lgd: 9934, lgdPct: 21.17, depreciationPct: 54.32,
    assetAgeGroup: '1-2 Years', residualValueForecast: 31061,
    residualLoss: 49938, residualRiskScore: 61.65,
    riskBand: 'High', profitabilityScore: 49.15,
    recommendedLtv: 65, recommendedTenure: 36, expectedProfit: 34222,
    state: 'Tamil Nadu', branch: 'Chennai',
    decision: 'APPROVE WITH CONDITIONS',
    riskDrivers: ['Low CIBIL Score', 'NREGI Employment', 'High LTV', 'High Residual Risk'],
    mitigations: ['Require 25% down payment', 'Add vehicle insurance + GAP coverage', 'Co-signer mandatory', 'Shorten tenure to 18 months'],
    shap: [
      { feature: 'CIBIL Score', value: 0.42, direction: 'negative' },
      { feature: 'Employment Type', value: 0.31, direction: 'negative' },
      { feature: 'LTV Ratio', value: 0.28, direction: 'negative' },
      { feature: 'Asset Age', value: 0.19, direction: 'negative' },
      { feature: 'Loan Amount', value: 0.15, direction: 'negative' },
      { feature: 'Net Salary', value: 0.12, direction: 'positive' },
      { feature: 'Asset Health', value: 0.09, direction: 'positive' },
      { feature: 'Customer Age', value: 0.06, direction: 'positive' },
    ],
    copilotText: `Based on comprehensive analysis of ASSET_1, this application presents elevated risk primarily driven by the absence of a CIBIL score and non-regular employment status. Despite a perfect Asset Health Index of 100, the residual value gap of ₹49,938 represents significant exposure.

**Risk Assessment: HIGH** — The combination of unverifiable creditworthiness (CIBIL: -1) and unstable income stream creates compounded default probability. The residual risk score of 61.65 exceeds our 60-point threshold for automatic approval.

**Recommendation: APPROVE WITH CONDITIONS** — TVS Credit can mitigate this risk through structured lending: increase down payment to 25% (reducing LTV from 85% to ~64%), mandate comprehensive vehicle insurance with GAP coverage, and require a creditworthy co-signer. Tenure should be capped at 18 months to minimize depreciation exposure.

**Expected Outcome:** With conditions applied, expected loss reduces from ₹23,220 to approximately ₹8,400, bringing the net expected return to ₹25,822 — a viable margin for TVS Credit's risk appetite.`,
  },
  ASSET_2: {
    agmtId: 'ASSET_2', custAge: 24, custGender: 'M', custCibil: -1,
    employment: 'NREGI', salary: 60000, coborrower: 'N',
    appScoreRisk: 'LOW RISK', assetModel: 'MOTORCYCLES', assetFuel: 'PETROL',
    loanAmount: 85600, ltv: 78.4, osBalance: 72100,
    assetHealthIndex: 92.0, recoveryEfficiency: 65.75,
    lgd: 29177, lgdPct: 34.25, depreciationPct: 47.57,
    assetAgeGroup: '0-1 Year', residualValueForecast: 49192,
    residualLoss: 57607, residualRiskScore: 53.94,
    riskBand: 'Low', profitabilityScore: 61.60,
    recommendedLtv: 75, recommendedTenure: 48, expectedProfit: 52100,
    state: 'Maharashtra', branch: 'Mumbai',
    decision: 'APPROVE',
    riskDrivers: ['Young Borrower', 'No CIBIL History'],
    mitigations: ['Standard monitoring', 'Quarterly check-in'],
    shap: [
      { feature: 'Net Salary', value: 0.38, direction: 'positive' },
      { feature: 'Asset Condition', value: 0.29, direction: 'positive' },
      { feature: 'CIBIL Score', value: 0.22, direction: 'negative' },
      { feature: 'LTV Ratio', value: 0.18, direction: 'positive' },
      { feature: 'Asset Age', value: 0.14, direction: 'positive' },
      { feature: 'Employment Type', value: 0.11, direction: 'negative' },
      { feature: 'Customer Age', value: 0.09, direction: 'negative' },
      { feature: 'Loan Amount', value: 0.07, direction: 'positive' },
    ],
    copilotText: `ASSET_2 presents a moderately favorable risk profile. While the applicant lacks a CIBIL history, the higher salary (₹60,000) and newer asset (0-1 Year) provide compensating factors.

**Risk Assessment: LOW** — The residual risk score of 53.94 falls below the high-risk threshold, and the profitability score of 61.60 indicates a viable lending opportunity.

**Recommendation: APPROVE** — Standard terms are acceptable. The asset's favorable depreciation profile and recovery efficiency provide adequate collateral coverage.`,
  },
  ASSET_3: {
    agmtId: 'ASSET_3', custAge: 32, custGender: 'F', custCibil: 763,
    employment: 'AGR', salary: 29500, coborrower: 'N',
    appScoreRisk: 'LOW RISK', assetModel: 'SCOOTERS', assetFuel: 'ELECTRIC',
    loanAmount: 92000, ltv: 72.1, osBalance: 68000,
    assetHealthIndex: 88.0, recoveryEfficiency: 78.37,
    lgd: 11178, lgdPct: 21.63, depreciationPct: 49.78,
    assetAgeGroup: '1-2 Years', residualValueForecast: 35015,
    residualLoss: 45634, residualRiskScore: 56.58,
    riskBand: 'Medium', profitabilityScore: 61.88,
    recommendedLtv: 70, recommendedTenure: 42, expectedProfit: 48900,
    state: 'Karnataka', branch: 'Bangalore',
    decision: 'APPROVE',
    riskDrivers: ['Agricultural Income Variability', 'EV Residual Value Uncertainty'],
    mitigations: ['EV insurance mandatory', 'Battery health certificate required'],
    shap: [
      { feature: 'CIBIL Score', value: 0.45, direction: 'positive' },
      { feature: 'Asset Health', value: 0.32, direction: 'positive' },
      { feature: 'LTV Ratio', value: 0.21, direction: 'positive' },
      { feature: 'Employment Type', value: 0.18, direction: 'negative' },
      { feature: 'Asset Fuel', value: 0.15, direction: 'negative' },
      { feature: 'Net Salary', value: 0.12, direction: 'negative' },
      { feature: 'Customer Age', value: 0.08, direction: 'positive' },
      { feature: 'Loan Amount', value: 0.06, direction: 'negative' },
    ],
    copilotText: `ASSET_3 demonstrates strong creditworthiness through a CIBIL score of 763, which significantly offsets the agricultural employment variability.

**Risk Assessment: MEDIUM** — The EV asset type introduces residual value uncertainty in the current market, but the borrower's credit profile is solid.

**Recommendation: APPROVE** — Approve with standard EV insurance requirement and battery health certification to protect against technological depreciation risk.`,
  },
}

// ─── Default Asset ─────────────────────────────────────────────────────────────
export const defaultAsset = assetDatabase['ASSET_1']

// ─── Portfolio Data ────────────────────────────────────────────────────────────
export const portfolioKPIs = {
  totalAssets: 1247,
  avgRiskScore: 57.3,
  highRiskCount: 312,
  mediumRiskCount: 489,
  lowRiskCount: 446,
  expectedLoss: 4820000,
  expectedProfit: 18650000,
  avgLTV: 74.6,
  avgProfitabilityScore: 58.2,
  recoveryRate: 71.4,
}

export const riskDistributionData = [
  { month: 'Mar', High: 41, Medium: 68, Low: 56 },
  { month: 'Apr', High: 38, Medium: 72, Low: 61 },
  { month: 'May', High: 45, Medium: 65, Low: 58 },
  { month: 'Jun', High: 52, Medium: 71, Low: 63 },
  { month: 'Jul', High: 48, Medium: 75, Low: 67 },
  { month: 'Aug', High: 44, Medium: 78, Low: 72 },
  { month: 'Sep', High: 50, Medium: 74, Low: 69 },
]

export const stateRiskData = [
  { state: 'Tamil Nadu', riskScore: 62.1, assets: 312, avgLTV: 78 },
  { state: 'Maharashtra', riskScore: 54.8, assets: 287, avgLTV: 72 },
  { state: 'Karnataka', riskScore: 58.3, assets: 198, avgLTV: 74 },
  { state: 'Andhra Pradesh', riskScore: 65.2, assets: 176, avgLTV: 80 },
  { state: 'Telangana', riskScore: 56.7, assets: 143, avgLTV: 71 },
  { state: 'Kerala', riskScore: 49.3, assets: 131, avgLTV: 68 },
]

export const assetCategoryData = [
  { name: 'Motorcycles', value: 38, color: '#E31E24' },
  { name: 'Scooters', value: 27, color: '#FF6B70' },
  { name: 'Mopeds', value: 18, color: '#FF9A9E' },
  { name: 'Electric Vehicles', value: 12, color: '#3B82F6' },
  { name: 'Others', value: 5, color: '#6B7280' },
]

export const profitabilityTrendData = [
  { month: 'Mar', profit: 1420000, loss: 380000 },
  { month: 'Apr', profit: 1580000, loss: 420000 },
  { month: 'May', profit: 1350000, loss: 510000 },
  { month: 'Jun', profit: 1690000, loss: 390000 },
  { month: 'Jul', profit: 1820000, loss: 360000 },
  { month: 'Aug', profit: 1940000, loss: 340000 },
  { month: 'Sep', profit: 1780000, loss: 420000 },
]

export const residualValueTrendData = [
  { month: 'M0', forecast: 100000, actual: 100000 },
  { month: 'M6', forecast: 87000, actual: 85200 },
  { month: 'M12', forecast: 74000, actual: 71800 },
  { month: 'M18', forecast: 62000, actual: 60100 },
  { month: 'M24', forecast: 51000, actual: 48900 },
  { month: 'M30', forecast: 41000, actual: null },
  { month: 'M36', forecast: 31061, actual: null },
]

// ─── Scenario Data ─────────────────────────────────────────────────────────────
export const scenarioData = {
  base: {
    label: 'Base Case',
    description: 'Current market conditions with no external shocks',
    residualValue: 31061,
    riskScore: 61.65,
    expectedProfit: 34222,
    lgdPct: 21.17,
    ltv: 85.2,
    color: '#6B7280',
  },
  ev_shock: {
    label: 'EV Market Shock',
    description: 'Rapid EV adoption causes 15% depreciation in ICE vehicle values',
    residualValue: 26402,
    riskScore: 68.30,
    expectedProfit: 28900,
    lgdPct: 29.40,
    ltv: 91.8,
    color: '#3B82F6',
    deltaResidual: -4659,
    deltaRisk: +6.65,
    deltaProfit: -5322,
  },
  high_inflation: {
    label: 'High Inflation',
    description: 'Inflation spike to 8% increases operational costs and default rates',
    residualValue: 28900,
    riskScore: 64.80,
    expectedProfit: 31500,
    lgdPct: 24.80,
    ltv: 88.5,
    color: '#F59E0B',
    deltaResidual: -2161,
    deltaRisk: +3.15,
    deltaProfit: -2722,
  },
  slowdown: {
    label: 'Economic Slowdown',
    description: 'GDP contraction reduces demand, increases unemployment & defaults',
    residualValue: 24890,
    riskScore: 72.40,
    expectedProfit: 22800,
    lgdPct: 33.90,
    ltv: 95.2,
    color: '#EF4444',
    deltaResidual: -6171,
    deltaRisk: +10.75,
    deltaProfit: -11422,
  },
}

// ─── Portfolio Table Data ──────────────────────────────────────────────────────
export const portfolioTableData = [
  { id: 'ASSET_1', model: 'MOPEDS', age: 29, cibil: -1, risk: 61.65, band: 'High', profit: 49.15, ltv: 85.2, decision: 'Conditional' },
  { id: 'ASSET_2', model: 'MOTORCYCLES', age: 24, cibil: -1, risk: 53.94, band: 'Low', profit: 61.60, ltv: 78.4, decision: 'Approve' },
  { id: 'ASSET_3', model: 'SCOOTERS', age: 32, cibil: 763, risk: 56.58, band: 'Medium', profit: 61.88, ltv: 72.1, decision: 'Approve' },
  { id: 'ASSET_4', model: 'MOPEDS', age: 25, cibil: -1, risk: 53.02, band: 'Low', profit: 51.46, ltv: 79.0, decision: 'Approve' },
  { id: 'ASSET_5', model: 'MOTORCYCLES', age: 59, cibil: 653, risk: 50.52, band: 'Low', profit: 89.47, ltv: 68.3, decision: 'Approve' },
  { id: 'ASSET_6', model: 'EV SCOOTERS', age: 34, cibil: 720, risk: 45.20, band: 'Low', profit: 74.20, ltv: 65.0, decision: 'Approve' },
  { id: 'ASSET_7', model: 'MOTORCYCLES', age: 41, cibil: -1, risk: 70.10, band: 'High', profit: 38.90, ltv: 92.1, decision: 'Reject' },
  { id: 'ASSET_8', model: 'MOPEDS', age: 27, cibil: 580, risk: 63.40, band: 'High', profit: 44.30, ltv: 87.5, decision: 'Conditional' },
]
