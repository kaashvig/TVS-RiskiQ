import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, Shield, DollarSign, AlertTriangle,
  Users, MapPin, PieChart, Activity, Target, ArrowUpRight,
  ArrowDownRight, ChevronRight, Layers
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RechartsPie, Pie, Cell,
  AreaChart, Area, RadialBarChart, RadialBar, Legend,
  Treemap
} from 'recharts'
import {
  portfolioKPIs, riskDistributionData, stateRiskData,
  assetCategoryData, profitabilityTrendData, portfolioTableData
} from '../data/mockData'
import { useTheme } from '../App'

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-4 py-3 shadow-xl border transition-colors duration-200" style={{
        background: isDark ? '#111116' : '#FFFFFF',
        borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
      }}>
        <p className="text-xs font-semibold mb-1" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs font-bold" style={{ color: p.color || p.fill }}>
            {p.name}: {typeof p.value === 'number' && p.value > 1000
              ? `₹${(p.value / 100000).toFixed(1)}L`
              : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const kpis = [
  { title: 'Total Assets', value: portfolioKPIs.totalAssets.toLocaleString(), icon: Layers, color: '#3B82F6', change: '+47', up: true },
  { title: 'Avg Risk Score', value: portfolioKPIs.avgRiskScore.toFixed(1), icon: Shield, color: '#F59E0B', change: '-2.1', up: true },
  { title: 'Expected Profit', value: `₹${(portfolioKPIs.expectedProfit / 100000).toFixed(0)}L`, icon: DollarSign, color: '#10B981', change: '+8.3%', up: true },
  { title: 'Expected Loss', value: `₹${(portfolioKPIs.expectedLoss / 100000).toFixed(0)}L`, icon: AlertTriangle, color: '#E31E24', change: '-12.4%', up: true },
  { title: 'Avg LTV', value: `${portfolioKPIs.avgLTV}%`, icon: Target, color: '#8B5CF6', change: '-1.2%', up: true },
  { title: 'Recovery Rate', value: `${portfolioKPIs.recoveryRate}%`, icon: Activity, color: '#06B6D4', change: '+3.2%', up: true },
]

const riskBandData = [
  { name: 'High Risk', value: portfolioKPIs.highRiskCount, color: '#E31E24', pct: ((portfolioKPIs.highRiskCount / portfolioKPIs.totalAssets) * 100).toFixed(1) },
  { name: 'Medium Risk', value: portfolioKPIs.mediumRiskCount, color: '#F59E0B', pct: ((portfolioKPIs.mediumRiskCount / portfolioKPIs.totalAssets) * 100).toFixed(1) },
  { name: 'Low Risk', value: portfolioKPIs.lowRiskCount, color: '#10B981', pct: ((portfolioKPIs.lowRiskCount / portfolioKPIs.totalAssets) * 100).toFixed(1) },
]

const heatmapData = [
  { model: 'Motorcycles', 'Low LTV': 15, 'Med LTV': 28, 'High LTV': 42 },
  { model: 'Scooters', 'Low LTV': 22, 'Med LTV': 35, 'High LTV': 31 },
  { model: 'Mopeds', 'Low LTV': 18, 'Med LTV': 40, 'High LTV': 48 },
  { model: 'EV Scooters', 'Low LTV': 8, 'Med LTV': 20, 'High LTV': 25 },
]

export default function PortfolioPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const axisColor = isDark ? 'rgba(255,255,255,0.6)' : '#475569'
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)'

  return (
    <div className="p-6 space-y-6 min-h-full bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Portfolio Digital Twin</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">Enterprise-wide portfolio analytics & risk intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-500">REAL-TIME</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="kpi-card !p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}20` }}>
                <kpi.icon size={14} style={{ color: kpi.color }} />
              </div>
              <div className={`flex items-center gap-0.5 text-[10px] font-semibold ${kpi.up ? 'text-emerald-500' : 'text-tvs-red'}`}>
                {kpi.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {kpi.change}
              </div>
            </div>
            <div className="text-lg font-bold text-[var(--text-primary)]">{kpi.value}</div>
            <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{kpi.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Risk Segmentation + Regional Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk Band Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Risk Segmentation</h3>
          <p className="text-xs text-[var(--text-muted)] mb-5">Portfolio risk band breakdown</p>

          <ResponsiveContainer width="100%" height={200}>
            <RechartsPie>
              <Pie
                data={riskBandData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {riskBandData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
            </RechartsPie>
          </ResponsiveContainer>

          <div className="space-y-3 mt-4">
            {riskBandData.map((band, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: band.color }} />
                  <span className="text-xs text-[var(--text-secondary)]">{band.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--text-primary)]">{band.value}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{band.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Regional Risk Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Regional Risk Distribution</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">State-wise risk scores & asset concentration</p>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-tvs-red" />
              <span className="text-[10px] text-[var(--text-muted)]">6 States</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {stateRiskData.map((state, i) => {
              const riskColor = state.riskScore > 60 ? '#E31E24' : state.riskScore > 55 ? '#F59E0B' : '#10B981'
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:bg-[var(--table-row-hover)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${riskColor}12`, border: `1px solid ${riskColor}20` }}>
                    <MapPin size={13} style={{ color: riskColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-[var(--text-primary)]">{state.state}</span>
                      <span className="text-xs font-bold" style={{ color: riskColor }}>{state.riskScore}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${state.riskScore}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.08 }}
                        className="h-full rounded-full"
                        style={{ background: riskColor }}
                      />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-semibold text-[var(--text-primary)]">{state.assets}</div>
                    <div className="text-[9px] text-[var(--text-muted)]">assets</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-semibold text-[var(--text-primary)]">{state.avgLTV}%</div>
                    <div className="text-[9px] text-[var(--text-muted)]">avg LTV</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Segmentation Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Asset Category Segmentation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Asset Category Performance</h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">Vehicle type distribution with risk overlay</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={[
              { name: 'Motorcycles', assets: 474, avgRisk: 56.2 },
              { name: 'Scooters', assets: 337, avgRisk: 52.8 },
              { name: 'Mopeds', assets: 224, avgRisk: 61.4 },
              { name: 'EV', assets: 150, avgRisk: 48.5 },
              { name: 'Others', assets: 62, avgRisk: 54.1 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 10 }} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Bar dataKey="assets" name="Assets" radius={[6, 6, 0, 0]} barSize={36}>
                {assetCategoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Risk Heatmap</h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">Average risk score by model × LTV segment</p>

          <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
            {/* Heatmap Header */}
            <div className="grid grid-cols-4 gap-px bg-[var(--border-subtle)]">
              <div className="p-2.5 bg-[var(--table-header-bg)]">
                <span className="text-[10px] text-[var(--text-muted)] font-semibold">Model</span>
              </div>
              {['Low LTV', 'Med LTV', 'High LTV'].map(h => (
                <div key={h} className="p-2.5 text-center bg-[var(--table-header-bg)]">
                  <span className="text-[10px] text-[var(--text-muted)] font-semibold">{h}</span>
                </div>
              ))}
            </div>

            {/* Heatmap Rows */}
            {heatmapData.map((row, ri) => (
              <motion.div
                key={ri}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + ri * 0.08 }}
                className="grid grid-cols-4 gap-px bg-[var(--border-subtle)]"
              >
                <div className="p-2.5 flex items-center bg-[var(--bg-card)]">
                  <span className="text-xs text-[var(--text-primary)] font-medium">{row.model}</span>
                </div>
                {['Low LTV', 'Med LTV', 'High LTV'].map((key) => {
                  const val = row[key]
                  const intensity = val / 50
                  const bgColor = val > 40
                    ? `rgba(227,30,36,${isDark ? 0.15 + intensity * 0.3 : 0.1 + intensity * 0.2})`
                    : val > 25
                      ? `rgba(245,158,11,${isDark ? 0.12 + intensity * 0.2 : 0.1 + intensity * 0.15})`
                      : `rgba(16,185,129,${isDark ? 0.1 + intensity * 0.15 : 0.1 + intensity * 0.1})`
                  const textColor = val > 40 ? '#E31E24' : val > 25 ? '#F59E0B' : '#10B981'

                  return (
                    <div key={key} className="p-2.5 text-center" style={{ background: bgColor }}>
                      <span className="text-sm font-bold" style={{ color: textColor }}>{val}</span>
                      <div className="text-[9px] text-[var(--text-muted)] mt-0.5">risk score</div>
                    </div>
                  )
                })}
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-4">
              {[
                { label: 'Low Risk', color: '#10B981' },
                { label: 'Medium Risk', color: '#F59E0B' },
                { label: 'High Risk', color: '#E31E24' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ background: `${l.color}30`, border: `1px solid ${l.color}40` }} />
                  <span className="text-[10px] text-[var(--text-muted)]">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profitability Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Profitability Trajectory</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Monthly profit vs loss with trend analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0.5 bg-emerald-500 rounded" />
              <span className="text-[10px] text-[var(--text-muted)]">Profit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0.5 bg-tvs-red rounded" />
              <span className="text-[10px] text-[var(--text-muted)]">Loss</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={profitabilityTrendData}>
            <defs>
              <linearGradient id="profitGradPort" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lossGradPort" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E31E24" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#E31E24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }}
              tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#profitGradPort)" name="Profit" />
            <Area type="monotone" dataKey="loss" stroke="#E31E24" strokeWidth={2} fill="url(#lossGradPort)" name="Loss" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
