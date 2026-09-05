import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, User, Bike, TrendingUp, TrendingDown, AlertTriangle,
  Shield, DollarSign, BarChart3, ChevronRight, Target,
  Info, Zap, CheckCircle, XCircle, Clock
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { assetDatabase, defaultAsset } from '../data/mockData'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-4 py-3" style={{
        background: 'rgba(17,17,22,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <p className="text-xs font-bold text-white">{payload[0].payload.feature}</p>
        <p className="text-xs text-white/60">Impact: {(payload[0].value * 100).toFixed(0)}%</p>
      </div>
    )
  }
  return null
}

export default function RiskIntelligencePage() {
  const [searchId, setSearchId] = useState('ASSET_1')
  const [asset, setAsset] = useState(defaultAsset)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      const found = assetDatabase[searchId.toUpperCase()]
      if (found) setAsset(found)
      setIsSearching(false)
    }, 600)
  }

  const predictionCards = [
    {
      title: 'Residual Value Forecast',
      value: `₹${asset.residualValueForecast.toLocaleString()}`,
      sub: `Depreciation: ${asset.depreciationPct}%`,
      icon: TrendingUp,
      color: '#3B82F6',
    },
    {
      title: 'Residual Risk Score',
      value: asset.residualRiskScore.toFixed(2),
      sub: `Band: ${asset.riskBand}`,
      icon: Shield,
      color: asset.riskBand === 'High' ? '#E31E24' : asset.riskBand === 'Medium' ? '#F59E0B' : '#10B981',
    },
    {
      title: 'Profitability Score',
      value: `${asset.profitabilityScore.toFixed(1)}%`,
      sub: `Expected: ₹${asset.expectedProfit.toLocaleString()}`,
      icon: DollarSign,
      color: '#10B981',
    },
    {
      title: 'Expected Loss (LGD)',
      value: `₹${asset.lgd.toLocaleString()}`,
      sub: `LGD %: ${asset.lgdPct}%`,
      icon: AlertTriangle,
      color: '#F59E0B',
    },
  ]

  const shapData = asset.shap.map(s => ({
    ...s,
    fill: s.direction === 'positive' ? '#10B981' : '#E31E24',
  }))

  return (
    <div className="p-6 space-y-6 bg-dark-950 min-h-full">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Asset Analysis</h2>
            <p className="text-xs text-white/40 mt-0.5">Search by Agreement ID to analyze individual assets</p>
          </div>
          <div className="flex items-center gap-2">
            {Object.keys(assetDatabase).map(id => (
              <button
                key={id}
                onClick={() => { setSearchId(id); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                  searchId === id
                    ? 'bg-tvs-red/20 text-tvs-red border border-tvs-red/30'
                    : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Enter Agreement ID (e.g., ASSET_1)"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="input-dark pl-9 w-full"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            className="btn-primary text-white px-6"
            disabled={isSearching}
          >
            {isSearching ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Clock size={16} />
              </motion.div>
            ) : (
              <>Analyze</>
            )}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={asset.agmtId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Profile Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Customer Profile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
                  <User size={18} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Customer Profile</h3>
                  <p className="text-xs text-white/35">{asset.agmtId}</p>
                </div>
                <div className="ml-auto">
                  <span className={`${
                    asset.decision === 'APPROVE' ? 'badge-approve' :
                    asset.decision.includes('CONDITION') ? 'badge-conditional' :
                    'badge-reject'
                  }`}>
                    {asset.decision}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                  { label: 'Age', value: asset.custAge },
                  { label: 'Gender', value: asset.custGender },
                  { label: 'CIBIL Score', value: asset.custCibil === -1 ? 'Not Available' : asset.custCibil },
                  { label: 'Employment', value: asset.employment },
                  { label: 'Salary', value: `₹${asset.salary.toLocaleString()}` },
                  { label: 'Co-borrower', value: asset.coborrower },
                  { label: 'State', value: asset.state },
                  { label: 'Branch', value: asset.branch },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                    <span className="text-xs text-white/40">{item.label}</span>
                    <span className="text-xs font-semibold text-white/80">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Asset Profile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(227,30,36,0.15)', border: '1px solid rgba(227,30,36,0.25)' }}>
                  <Bike size={18} className="text-tvs-red" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Asset Profile</h3>
                  <p className="text-xs text-white/35">{asset.assetModel} · {asset.assetFuel}</p>
                </div>
                <div className="ml-auto">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                    asset.riskBand === 'High' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                    asset.riskBand === 'Medium' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' :
                    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {asset.riskBand} Risk
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                  { label: 'Loan Amount', value: `₹${asset.loanAmount.toLocaleString()}` },
                  { label: 'LTV Ratio', value: `${asset.ltv}%` },
                  { label: 'Outstanding', value: `₹${asset.osBalance.toLocaleString()}` },
                  { label: 'Asset Age', value: asset.assetAgeGroup },
                  { label: 'Health Index', value: `${asset.assetHealthIndex}%` },
                  { label: 'Recovery Eff.', value: `${asset.recoveryEfficiency}%` },
                  { label: 'Rec. LTV', value: `${asset.recommendedLtv}%` },
                  { label: 'Rec. Tenure', value: `${asset.recommendedTenure} months` },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                    <span className="text-xs text-white/40">{item.label}</span>
                    <span className="text-xs font-semibold text-white/80">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Prediction Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {predictionCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="glass-card p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${card.color}15`, border: `1px solid ${card.color}25` }}>
                    <card.icon size={15} style={{ color: card.color }} />
                  </div>
                  <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">{card.title}</span>
                </div>
                <div className="text-xl font-bold text-white mb-1">{card.value}</div>
                <div className="text-xs text-white/40">{card.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Explainable AI Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* SHAP Feature Importance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-5 lg:col-span-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-tvs-red" />
                <h3 className="text-sm font-bold text-white">Explainable AI — Feature Importance</h3>
              </div>
              <p className="text-xs text-white/35 mb-5">SHAP-style impact analysis on risk prediction</p>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={shapData} layout="vertical" barCategoryGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                    tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                  <YAxis type="category" dataKey="feature" axisLine={false} tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
                    {shapData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500/80" />
                  <span className="text-[10px] text-white/50">Positive Impact (Reduces Risk)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500/80" />
                  <span className="text-[10px] text-white/50">Negative Impact (Increases Risk)</span>
                </div>
              </div>
            </motion.div>

            {/* Risk Drivers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-5"
            >
              {/* Risk Drivers Card */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={14} className="text-tvs-red" />
                  <h4 className="text-sm font-bold text-white">Risk Drivers</h4>
                </div>
                <div className="space-y-2.5">
                  {asset.riskDrivers.map((driver, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(227,30,36,0.06)', border: '1px solid rgba(227,30,36,0.12)' }}
                    >
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-tvs-red/15">
                        <XCircle size={12} className="text-tvs-red" />
                      </div>
                      <span className="text-xs text-white/70 font-medium">{driver}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mitigations Card */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Recommended Mitigations</h4>
                </div>
                <div className="space-y-2.5">
                  {asset.mitigations.map((mit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}
                    >
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-emerald-400/15">
                        <CheckCircle size={12} className="text-emerald-400" />
                      </div>
                      <span className="text-xs text-white/70 font-medium">{mit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
