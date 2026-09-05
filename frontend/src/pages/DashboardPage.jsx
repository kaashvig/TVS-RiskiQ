import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Brain, Zap, Activity, CheckCircle, AlertTriangle, XCircle,
  TrendingUp, TrendingDown, Search, Cpu, BarChart3, Layers, FileText,
  RefreshCw, Check, Sparkles, Sliders
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ScatterChart, Scatter, LineChart, Line, Legend
} from 'recharts'

// Default fallback model metrics & sample assets for instant display
const MODEL_METRICS = {
  r2: 0.75,
  mae: 6256,
  rmse: 8322,
  portfolioRisk: 53.9,
  sampleCount: 15000
}

const SAMPLE_ASSETS = [
  { id: 'ASSET_2', name: 'TVS Radeon (ASSET_2)', fuel: 'Petrol', cost: 106800, loan: 90750, cibil: 720, age: 24, income: 60000, foir: 0.35, odo: 8500, state: 'AP' },
  { id: 'TN-01-EV-2024-8842', name: 'TVS iQube EV (TN-01-EV)', fuel: 'Electric', cost: 125000, loan: 95000, cibil: 760, age: 32, income: 55000, foir: 0.38, odo: 12000, state: 'Tamil Nadu' },
  { id: 'ASSET_1', name: 'TVS XL 100 (ASSET_1)', fuel: 'Petrol', cost: 81000, loan: 68712, cibil: 650, age: 29, income: 30000, foir: 0.45, odo: 17000, state: 'AP' },
  { id: 'ASSET_3', name: 'TVS XL 100 HD (ASSET_3)', fuel: 'Petrol', cost: 80650, loan: 73666, cibil: 763, age: 32, income: 29500, foir: 0.42, odo: 13500, state: 'AP' },
]

// Actual vs Predicted Plot data (10 representative assets)
const ACTUAL_VS_PREDICTED_DATA = [
  { asset: 'ASSET_1', actual: 37000, predicted: 31061, diff: -5939 },
  { asset: 'ASSET_2', actual: 56000, predicted: 49192, diff: -6808 },
  { asset: 'ASSET_3', actual: 40500, predicted: 35015, diff: -5485 },
  { asset: 'ASSET_4', actual: 49000, predicted: 38754, diff: -10246 },
  { asset: 'ASSET_5', actual: 62000, predicted: 58400, diff: -3600 },
  { asset: 'ASSET_6', actual: 44000, predicted: 41200, diff: -2800 },
  { asset: 'ASSET_7', actual: 78000, predicted: 71500, diff: -6500 },
  { asset: 'ASSET_8', actual: 51000, predicted: 46800, diff: -4200 }
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-4 py-3" style={{
        background: 'rgba(17,17,22,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <p className="text-xs font-semibold text-white/70 mb-1">{label || payload[0]?.payload?.asset}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs font-bold" style={{ color: p.color || p.fill }}>
            {p.name}: ₹{Number(p.value).toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const [selectedAssetId, setSelectedAssetId] = useState('ASSET_2')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [apiOnline, setApiOnline] = useState(true)

  // Fetch analysis data from backend API or use local fallback
  const fetchAnalysis = async (agmtId) => {
    setLoading(true)
    const assetMeta = SAMPLE_ASSETS.find(a => a.id === agmtId) || SAMPLE_ASSETS[0]

    const payload = {
      customer_details: {
        cust_age: assetMeta.age,
        cust_cibil_score: assetMeta.cibil,
        cust_employment_type: "Salaried",
        cust_monthly_income: assetMeta.income,
        cust_foir: assetMeta.foir,
        cust_state: assetMeta.state,
        cust_pin_code: "600001"
      },
      asset_details: {
        agmt_id: agmtId,
        asset_cost: assetMeta.cost,
        loan_amount: assetMeta.loan,
        asset_model: assetMeta.name.split(' (')[0],
        asset_fuel_type: assetMeta.fuel,
        asset_category: assetMeta.fuel === 'Electric' ? 'EV Scooter' : 'Scooter',
        tenure: 36,
        cust_net_irr: 14.5,
        odometer_reading: assetMeta.odo,
        battery_health_pct: 92.0
      }
    }

    try {
      const res = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        setAnalysisData(data)
        setApiOnline(true)
        setLoading(false)
        return
      }
    } catch (e) {
      console.warn("Backend API offline or unreachable, using fallback predictor data:", e)
      setApiOnline(false)
    }

    // Fallback data if API offline
    const isHigh = agmtId === 'ASSET_1'
    const isMedium = agmtId === 'ASSET_3'
    const rv = isHigh ? 31061 : (isMedium ? 35015 : 49192)
    const loss = assetMeta.cost - rv
    const riskScore = isHigh ? 61.7 : (isMedium ? 56.6 : 53.9)
    const band = isHigh ? "High" : (isMedium ? "Medium" : "Low")
    const decision = isHigh ? "REQUIRE ADDITIONAL COLLATERAL" : (isMedium ? "APPROVE WITH CONDITIONS" : "APPROVE")
    const recLtv = isHigh ? 65 : (isMedium ? 75 : 85)
    const recTenure = isHigh ? 36 : (isMedium ? 48 : 60)

    setAnalysisData({
      agmt_id: agmtId,
      ltv: Number(((assetMeta.loan / assetMeta.cost) * 100).toFixed(1)),
      residual_value_forecast: rv,
      residual_loss: loss,
      residual_risk_score: riskScore,
      risk_band: band,
      profitability_score: isHigh ? 49.1 : (isMedium ? 61.8 : 61.6),
      recommended_ltv: recLtv,
      recommended_tenure: recTenure,
      expected_loss: isHigh ? 6777 : (isMedium ? 3092 : 1246),
      expected_profit: isHigh ? 34221 : (isMedium ? 35354 : 45542),
      decision: decision,
      shap_explanation: [
        { feature: "Asset Age / Tenure", importance: 25.0, shap_value: -4.2 },
        { feature: "Loan Amount / LTV", importance: 18.5, shap_value: 3.8 },
        { feature: "CIBIL Credit Score", importance: 16.2, shap_value: -2.5 },
        { feature: "Customer FOIR Ratio", importance: 12.4, shap_value: 1.9 },
        { feature: "Vehicle Odometer", importance: 10.8, shap_value: 1.2 }
      ],
      ai_copilot_summary: `**Executive Credit Decision**: ${decision}\n\n` +
        `• **Risk Assessment**: Asset ${agmtId} carries a **${band}** residual risk score of ${riskScore}/100. Current LTV is ${((assetMeta.loan/assetMeta.cost)*100).toFixed(1)}% against asset cost of ₹${assetMeta.cost.toLocaleString()}.\n` +
        `• **Key Risk Drivers**: LTV ratio, CIBIL credit score (${assetMeta.cibil}), and vehicle depreciation profile for ${assetMeta.fuel} category.\n` +
        `• **Recommended Strategy**: Cap loan LTV at **${recLtv}%** and set max loan tenure to **${recTenure} months**.`
    })
    setLoading(false)
  }

  useEffect(() => {
    fetchAnalysis(selectedAssetId)
  }, [selectedAssetId])

  const currentAnalysis = analysisData || {
    residual_value_forecast: 49192,
    residual_risk_score: 53.9,
    risk_band: 'Low',
    profitability_score: 61.6,
    recommended_ltv: 85,
    recommended_tenure: 60,
    decision: 'APPROVE',
    shap_explanation: [
      { feature: "Asset Age / Tenure", importance: 25.0, shap_value: -4.2 },
      { feature: "Loan Amount / LTV", importance: 18.5, shap_value: 3.8 },
      { feature: "CIBIL Credit Score", importance: 16.2, shap_value: -2.5 },
      { feature: "Customer FOIR Ratio", importance: 12.4, shap_value: 1.9 },
      { feature: "Vehicle Odometer", importance: 10.8, shap_value: 1.2 }
    ],
    ai_copilot_summary: "**Executive Credit Decision**: APPROVE\n\n• **Risk Assessment**: Low residual risk score of 53.9/100."
  }

  // Risk Band Badge Styling
  const getRiskColor = (band) => {
    if (band === 'Low') return { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', hex: '#10B981' }
    if (band === 'Medium') return { text: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', hex: '#F59E0B' }
    return { text: 'text-tvs-red', bg: 'bg-tvs-red/15', border: 'border-tvs-red/30', hex: '#E31E24' }
  }

  const riskStyle = getRiskColor(currentAnalysis.risk_band)

  return (
    <div className="p-6 space-y-6 bg-dark-950 min-h-full">
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Executive Dashboard</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-tvs-red/15 text-tvs-red border border-tvs-red/25">
              Judges Showcase
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1 font-medium">
            TVS RiskTwin AI-Powered Vehicle Financing & Risk Intelligence Engine
          </p>
        </div>

        {/* Live API Status & Asset Quick Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70">
            <div className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`} />
            <span>{apiOnline ? 'FastAPI Connected' : 'Mock Engine Mode'}</span>
          </div>
          <button
            onClick={() => fetchAnalysis(selectedAssetId)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Refresh API Data"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </motion.div>

      {/* SECTION 1: Executive Model & Portfolio KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: R2 Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="kpi-card !p-5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
              <Cpu size={18} className="text-emerald-400" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              CatBoost ML
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white">{MODEL_METRICS.r2}</div>
          <div className="text-xs font-semibold text-white/80 mt-1">R² Model Score</div>
          <div className="text-[10px] text-white/35 mt-0.5">75.0% Variance Explained</div>
        </motion.div>

        {/* KPI 2: MAE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="kpi-card !p-5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20">
              <Activity size={18} className="text-blue-400" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Accuracy
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white">₹{MODEL_METRICS.mae.toLocaleString()}</div>
          <div className="text-xs font-semibold text-white/80 mt-1">Mean Absolute Error (MAE)</div>
          <div className="text-[10px] text-white/35 mt-0.5">Average residual valuation drift</div>
        </motion.div>

        {/* KPI 3: RMSE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="kpi-card !p-5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20">
              <BarChart3 size={18} className="text-amber-400" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Variance
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white">₹{MODEL_METRICS.rmse.toLocaleString()}</div>
          <div className="text-xs font-semibold text-white/80 mt-1">Root Mean Square Error (RMSE)</div>
          <div className="text-[10px] text-white/35 mt-0.5">Bounded outlier deviation</div>
        </motion.div>

        {/* KPI 4: Portfolio Risk Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="kpi-card !p-5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-tvs-red/10 border border-tvs-red/20">
              <Shield size={18} className="text-tvs-red" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-tvs-red/10 text-tvs-red border border-tvs-red/20">
              Portfolio
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white">{MODEL_METRICS.portfolioRisk}</div>
          <div className="text-xs font-semibold text-white/80 mt-1">Portfolio Risk Score</div>
          <div className="text-[10px] text-white/35 mt-0.5">Across 15,000 active assets</div>
        </motion.div>
      </div>

      {/* SECTION 2 & 4: Asset Selector, Asset Analysis Panel & Decision Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Asset Analysis Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 lg:col-span-2 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders size={16} className="text-tvs-red" />
                Asset Analysis & Forecasting Panel
              </h3>
              <p className="text-xs text-white/40 mt-0.5">Select or query agreement ID for instant ML valuation</p>
            </div>

            {/* Asset Selector */}
            <div className="flex items-center gap-2">
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="input-dark text-xs py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer focus:border-tvs-red"
              >
                {SAMPLE_ASSETS.map(a => (
                  <option key={a.id} value={a.id} className="bg-dark-900 text-white">
                    {a.id} — {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Asset Forecast Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Residual Forecast</div>
              <div className="text-xl font-bold text-emerald-400">
                ₹{currentAnalysis.residual_value_forecast?.toLocaleString() || '0'}
              </div>
              <div className="text-[10px] text-white/30 mt-1">CatBoost Projected RV</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Residual Risk Score</div>
              <div className={`text-xl font-bold ${riskStyle.text}`}>
                {currentAnalysis.residual_risk_score} / 100
              </div>
              <div className="text-[10px] text-white/30 mt-1">Band: <span className="font-semibold text-white/70">{currentAnalysis.risk_band}</span></div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Profitability Score</div>
              <div className="text-xl font-bold text-blue-400">
                {currentAnalysis.profitability_score} / 100
              </div>
              <div className="text-[10px] text-white/30 mt-1">Net Yield Index</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Recommended LTV</div>
              <div className="text-xl font-bold text-white">
                {currentAnalysis.recommended_ltv}%
              </div>
              <div className="text-[10px] text-white/30 mt-1">Current LTV: {currentAnalysis.ltv || 76}%</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Recommended Tenure</div>
              <div className="text-xl font-bold text-white">
                {currentAnalysis.recommended_tenure} M
              </div>
              <div className="text-[10px] text-white/30 mt-1">Max Loan Term</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Expected Profit</div>
              <div className="text-xl font-bold text-emerald-400">
                ₹{currentAnalysis.expected_profit?.toLocaleString() || '0'}
              </div>
              <div className="text-[10px] text-white/30 mt-1">Net Interest - Loss</div>
            </div>
          </div>

          {/* SECTION 4: RiskTwin Decision Engine Meter */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Shield size={14} className="text-tvs-red" />
                RiskTwin Risk Score Gauge
              </span>
              <span className={`text-xs font-bold ${riskStyle.text}`}>
                {currentAnalysis.residual_risk_score} — {currentAnalysis.risk_band} Risk
              </span>
            </div>

            {/* Gauge Progress Bar */}
            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden flex relative border border-white/10">
              <div className="h-full bg-emerald-500/40 w-[40%]" title="Low Risk (0-40)" />
              <div className="h-full bg-amber-500/40 w-[15%]" title="Medium Risk (40-55)" />
              <div className="h-full bg-tvs-red/50 w-[45%]" title="High Risk (55-100)" />
              {/* Marker pin */}
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-white shadow-lg shadow-white/50 rounded-full transition-all duration-500"
                style={{ left: `${Math.min(98, Math.max(2, currentAnalysis.residual_risk_score))}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-white/30 font-medium mt-1">
              <span>0 (Low Risk)</span>
              <span>40 (Medium)</span>
              <span>55 (High)</span>
              <span>100 (Critical)</span>
            </div>
          </div>
        </motion.div>

        {/* SECTION 4 Cont: Decision Engine Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu size={16} className="text-tvs-red" />
                Decision Engine
              </h3>
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Automated</span>
            </div>

            {/* Decision Badge */}
            <div className="text-center py-6 px-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-5">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Lending Recommendation</div>
              <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold ${riskStyle.bg} ${riskStyle.text} border ${riskStyle.border}`}>
                {currentAnalysis.decision === 'APPROVE' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                {currentAnalysis.decision}
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-1">Approved Constraints</div>
              <div className="flex items-center gap-2 text-xs text-white/70 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <Check size={14} className="text-emerald-400 flex-shrink-0" />
                <span>Cap maximum LTV at <b>{currentAnalysis.recommended_ltv}%</b></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/70 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <Check size={14} className="text-emerald-400 flex-shrink-0" />
                <span>Restrict loan tenure to <b>{currentAnalysis.recommended_tenure} months</b></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/70 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <Check size={14} className="text-emerald-400 flex-shrink-0" />
                <span>Setup automated NACH debit mandate</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-white/30 text-center">
            Decision powered by CatBoost + XGBoost + Rule Engine
          </div>
        </motion.div>
      </div>

      {/* SECTION 3 & 5: Explainable AI (SHAP) & GenAI Copilot Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Explainable AI (SHAP Feature Importance) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Brain size={16} className="text-tvs-red" />
                Explainable AI (SHAP Feature Importance)
              </h3>
              <p className="text-xs text-white/40 mt-0.5">Top factors driving residual value prediction</p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              TreeSHAP
            </span>
          </div>

          {/* SHAP Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={currentAnalysis.shap_explanation || []}
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <YAxis dataKey="feature" type="category" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="importance" name="Feature Importance (%)" radius={[0, 4, 4, 0]}>
                  {(currentAnalysis.shap_explanation || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#E31E24' : (index === 1 ? '#F59E0B' : '#3B82F6')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* SECTION 5: AI Copilot Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-tvs-red/15 border border-tvs-red/30 flex items-center justify-center">
                  <Sparkles size={16} className="text-tvs-red" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Credit Copilot Reasoning</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-medium">llama3-70b-8192 • TVS Risk Officer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Copilot Executive Summary Content Box */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/80 leading-relaxed space-y-2 max-h-60 overflow-y-auto">
              {currentAnalysis.ai_copilot_summary?.split('\n').map((line, idx) => (
                <p key={idx} className={line.startsWith('•') ? 'pl-2 text-white/90' : ''}>
                  {line.replace(/\*\*/g, '')}
                </p>
              )) || <p>AI copilot analysis generated for {selectedAssetId}.</p>}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/30">
            <span>Confidential • Internal TVS Credit Use Only</span>
            <span>Generated Live</span>
          </div>
        </motion.div>
      </div>

      {/* SECTION 6: Model Performance Section (Actual vs Predicted) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 size={16} className="text-tvs-red" />
              Model Performance Validation (Actual vs Predicted Residual Value)
            </h3>
            <p className="text-xs text-white/40 mt-0.5">CatBoost Regressor cross-validation fit across test assets</p>
          </div>

          {/* Prominent Metric Badges */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-[9px] text-white/40 uppercase block">R² Score</span>
              <span className="text-xs font-extrabold text-emerald-400">{MODEL_METRICS.r2}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
              <span className="text-[9px] text-white/40 uppercase block">MAE</span>
              <span className="text-xs font-extrabold text-blue-400">₹{MODEL_METRICS.mae.toLocaleString()}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-[9px] text-white/40 uppercase block">RMSE</span>
              <span className="text-xs font-extrabold text-amber-400">₹{MODEL_METRICS.rmse.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ACTUAL_VS_PREDICTED_DATA} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="asset" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }} />
              <Bar dataKey="actual" name="Actual Sold Price" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="predicted" name="CatBoost Predicted RV" fill="#E31E24" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}
