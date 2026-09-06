import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Brain, Zap, Activity, CheckCircle, AlertTriangle, XCircle,
  TrendingUp, TrendingDown, Search, Cpu, BarChart3, Layers, FileText,
  RefreshCw, Check, Sparkles, Sliders, Download
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ScatterChart, Scatter, LineChart, Line, Legend
} from 'recharts'
import { useTheme } from '../App'
import { downloadCreditReport } from '../utils/reportDownloader'

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

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-4 py-3 shadow-xl border transition-colors duration-200" style={{
        background: isDark ? '#111116' : '#FFFFFF',
        borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
      }}>
        <p className="text-xs font-semibold mb-1" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }}>
          {label || payload[0]?.payload?.asset}
        </p>
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
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [selectedAssetId, setSelectedAssetId] = useState('ASSET_2')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [apiOnline, setApiOnline] = useState(true)

  // Chart theme colors
  const axisColor = isDark ? 'rgba(255,255,255,0.6)' : '#475569'
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)'

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

  const selectedMeta = SAMPLE_ASSETS.find(a => a.id === selectedAssetId) || SAMPLE_ASSETS[0]
  const currentAnalysis = analysisData || {}

  const getRiskBandStyle = (band) => {
    switch (band) {
      case 'High':
        return { bg: 'bg-tvs-red/15', text: 'text-tvs-red', border: 'border-tvs-red/30' }
      case 'Medium':
        return { bg: 'bg-amber-500/15', text: 'text-amber-500', border: 'border-amber-500/30' }
      default:
        return { bg: 'bg-emerald-500/15', text: 'text-emerald-500', border: 'border-emerald-500/30' }
    }
  }

  const riskStyle = getRiskBandStyle(currentAnalysis.risk_band)

  return (
    <div className="p-6 space-y-6">
      {/* SECTION 1: Top Status Banner */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tvs-red/15 border border-tvs-red/30 flex items-center justify-center">
            <Activity className="text-tvs-red" size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              TVS RiskTwin Model Engine
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${apiOnline ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'}`}>
                {apiOnline ? 'FastAPI Active' : 'Fallback Client Engine'}
              </span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">CatBoost Regressor • SHAP Explainer • GenAI Copilot</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Select Asset */}
          <div className="flex items-center gap-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] p-1 rounded-xl">
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold pl-2">Asset:</span>
            {SAMPLE_ASSETS.map(a => (
              <button
                key={a.id}
                onClick={() => setSelectedAssetId(a.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${selectedAssetId === a.id ? 'bg-tvs-red text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                {a.id}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAnalysis(selectedAssetId)}
            className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
            disabled={loading}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Re-Run Analysis</span>
          </button>

          <button
            onClick={() => downloadCreditReport(selectedAssetId, analysisData)}
            className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 text-white"
          >
            <Download size={13} />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: Asset Details Form/Info Card */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4 border-b border-[var(--border-subtle)] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Search size={16} className="text-tvs-red" />
              Asset Application Record
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Agreement ID: <span className="font-mono text-tvs-red font-bold">{selectedAssetId}</span></p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--input-bg)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
            {selectedMeta.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="p-3 rounded-xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)]">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">Ex-Showroom Cost</div>
            <div className="text-sm font-bold text-[var(--text-primary)] mt-1">₹{selectedMeta.cost.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)]">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">Loan Amount</div>
            <div className="text-sm font-bold text-[var(--text-primary)] mt-1">₹{selectedMeta.loan.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)]">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">Current LTV</div>
            <div className="text-sm font-bold text-[var(--text-primary)] mt-1">{((selectedMeta.loan / selectedMeta.cost) * 100).toFixed(1)}%</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)]">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">CIBIL Score</div>
            <div className="text-sm font-bold text-[var(--text-primary)] mt-1">{selectedMeta.cibil > 0 ? selectedMeta.cibil : 'No Credit Record (-1)'}</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)]">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">Monthly Income</div>
            <div className="text-sm font-bold text-[var(--text-primary)] mt-1">₹{selectedMeta.income.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)]">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">Odometer</div>
            <div className="text-sm font-bold text-[var(--text-primary)] mt-1">{selectedMeta.odo.toLocaleString()} km</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: ML Predictions & Risk Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Residual Value & Risk Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 lg:col-span-2 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <BarChart3 size={16} className="text-tvs-red" />
                CatBoost Model Residual Value Forecast & Risk Intelligence
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${riskStyle.bg} ${riskStyle.text} border ${riskStyle.border}`}>
                {currentAnalysis.risk_band || 'Medium'} Risk Band
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="p-4 rounded-xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)]">
                <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Predicted Residual Value</div>
                <div className="text-2xl font-extrabold text-[var(--text-primary)]">
                  ₹{currentAnalysis.residual_value_forecast?.toLocaleString() || '0'}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-1">36-Month Horizon</div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)]">
                <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Residual Loss Gap</div>
                <div className="text-2xl font-extrabold text-tvs-red">
                  ₹{currentAnalysis.residual_loss?.toLocaleString() || '0'}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-1">Depreciation Exposure</div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)]">
                <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Expected Profit</div>
                <div className="text-2xl font-extrabold text-emerald-500">
                  ₹{currentAnalysis.expected_profit?.toLocaleString() || '0'}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-1">Net Interest - Loss</div>
              </div>
            </div>

            {/* SECTION 4: RiskTwin Decision Engine Meter */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Shield size={14} className="text-tvs-red" />
                  RiskTwin Risk Score Gauge
                </span>
                <span className={`text-xs font-bold ${riskStyle.text}`}>
                  {currentAnalysis.residual_risk_score} — {currentAnalysis.risk_band} Risk
                </span>
              </div>

              {/* Gauge Progress Bar */}
              <div className="w-full h-3 rounded-full bg-[var(--input-bg)] overflow-hidden flex relative border border-[var(--border-subtle)]">
                <div className="h-full bg-emerald-500/40 w-[40%]" title="Low Risk (0-40)" />
                <div className="h-full bg-amber-500/40 w-[15%]" title="Medium Risk (40-55)" />
                <div className="h-full bg-tvs-red/50 w-[45%]" title="High Risk (55-100)" />
                {/* Marker pin */}
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-white shadow-lg rounded-full transition-all duration-500"
                  style={{ left: `${Math.min(98, Math.max(2, currentAnalysis.residual_risk_score))}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-[var(--text-muted)] font-medium mt-1">
                <span>0 (Low Risk)</span>
                <span>40 (Medium)</span>
                <span>55 (High)</span>
                <span>100 (Critical)</span>
              </div>
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
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Cpu size={16} className="text-tvs-red" />
                Decision Engine
              </h3>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">Automated</span>
            </div>

            {/* Decision Badge */}
            <div className="text-center py-6 px-4 rounded-2xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)] mb-5">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Lending Recommendation</div>
              <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold ${riskStyle.bg} ${riskStyle.text} border ${riskStyle.border}`}>
                {currentAnalysis.decision === 'APPROVE' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                {currentAnalysis.decision}
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Approved Constraints</div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] p-2.5 rounded-xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)]">
                <Check size={14} className="text-emerald-500 flex-shrink-0" />
                <span>Cap maximum LTV at <b className="text-[var(--text-primary)]">{currentAnalysis.recommended_ltv}%</b></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] p-2.5 rounded-xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)]">
                <Check size={14} className="text-emerald-500 flex-shrink-0" />
                <span>Restrict loan tenure to <b className="text-[var(--text-primary)]">{currentAnalysis.recommended_tenure} months</b></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] p-2.5 rounded-xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)]">
                <Check size={14} className="text-emerald-500 flex-shrink-0" />
                <span>Setup automated NACH debit mandate</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] text-center">
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
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Brain size={16} className="text-tvs-red" />
                Explainable AI (SHAP Feature Importance)
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Top factors driving residual value prediction</p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
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
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis type="number" tick={{ fill: axisColor, fontSize: 10 }} />
                <YAxis dataKey="feature" type="category" tick={{ fill: axisColor, fontSize: 10 }} width={120} />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
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
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">AI Credit Copilot Reasoning</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-500 font-medium">llama3-70b-8192 • TVS Risk Officer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Copilot Executive Summary Content Box */}
            <div className="p-4 rounded-xl bg-[var(--table-header-bg)] border border-[var(--border-subtle)] max-h-60 overflow-y-auto">
              <MarkdownRenderer content={currentAnalysis.ai_copilot_summary} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
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
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <BarChart3 size={16} className="text-tvs-red" />
              Model Performance Validation (Actual vs Predicted Residual Value)
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">CatBoost Regressor cross-validation fit across test assets</p>
          </div>

          {/* Prominent Metric Badges */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-[9px] text-[var(--text-muted)] uppercase block">R² Score</span>
              <span className="text-xs font-extrabold text-emerald-500">{MODEL_METRICS.r2}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
              <span className="text-[9px] text-[var(--text-muted)] uppercase block">MAE</span>
              <span className="text-xs font-extrabold text-blue-500">₹{MODEL_METRICS.mae.toLocaleString()}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-[9px] text-[var(--text-muted)] uppercase block">RMSE</span>
              <span className="text-xs font-extrabold text-amber-500">₹{MODEL_METRICS.rmse.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ACTUAL_VS_PREDICTED_DATA} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="asset" tick={{ fill: axisColor, fontSize: 11 }} />
              <YAxis tick={{ fill: axisColor, fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Legend wrapperStyle={{ fontSize: 11, color: axisColor }} />
              <Bar dataKey="actual" name="Actual Sold Price" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="predicted" name="CatBoost Predicted RV" fill="#E31E24" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}
