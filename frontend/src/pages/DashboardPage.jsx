import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, AlertTriangle, DollarSign,
  Users, Shield, Activity, ChevronRight, Search,
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell,
  Legend
} from 'recharts'
import {
  portfolioKPIs, riskDistributionData, residualValueTrendData,
  profitabilityTrendData, assetCategoryData, portfolioTableData
} from '../data/mockData'

const kpiCards = [
  {
    title: 'Total Portfolio',
    value: `₹${(portfolioKPIs.expectedProfit / 100000).toFixed(0)}L`,
    sub: `${portfolioKPIs.totalAssets} assets under management`,
    change: '+12.4%',
    up: true,
    icon: DollarSign,
    color: '#10B981',
  },
  {
    title: 'Avg Risk Score',
    value: portfolioKPIs.avgRiskScore.toFixed(1),
    sub: 'Portfolio weighted average',
    change: '-2.1',
    up: true,
    icon: Shield,
    color: '#F59E0B',
  },
  {
    title: 'High Risk Assets',
    value: portfolioKPIs.highRiskCount,
    sub: `${((portfolioKPIs.highRiskCount / portfolioKPIs.totalAssets) * 100).toFixed(1)}% of portfolio`,
    change: '+18',
    up: false,
    icon: AlertTriangle,
    color: '#E31E24',
  },
  {
    title: 'Recovery Rate',
    value: `${portfolioKPIs.recoveryRate}%`,
    sub: 'Last 90 days average',
    change: '+3.2%',
    up: true,
    icon: TrendingUp,
    color: '#3B82F6',
  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-4 py-3" style={{
        background: 'rgba(17,17,22,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
      }}>
        <p className="text-xs font-semibold text-white/60 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs font-bold" style={{ color: p.color }}>
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

const PIE_COLORS = ['#E31E24', '#FF6B70', '#FF9A9E', '#3B82F6', '#6B7280']

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="p-6 space-y-6 bg-dark-950 min-h-full">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-sm text-white/40 mt-1">Real-time portfolio health & risk metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-dark pl-9 pr-4 py-2.5 w-64 text-xs"
            />
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="kpi-card group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${kpi.color}18`, border: `1px solid ${kpi.color}30` }}>
                <kpi.icon size={18} style={{ color: kpi.color }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {kpi.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-xs text-white/40">{kpi.sub}</div>
            <div className="text-[10px] text-white/30 mt-2 font-medium">{kpi.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Risk Distribution Trend</h3>
              <p className="text-xs text-white/35 mt-0.5">Monthly risk band breakdown</p>
            </div>
            <div className="flex items-center gap-4">
              {[
                { label: 'High', color: '#E31E24' },
                { label: 'Medium', color: '#F59E0B' },
                { label: 'Low', color: '#10B981' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span className="text-[10px] text-white/50 font-medium">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={riskDistributionData} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="High" fill="#E31E24" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Medium" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Low" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Asset Category Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-bold text-white mb-1">Asset Composition</h3>
          <p className="text-xs text-white/35 mb-4">By vehicle category</p>
          <ResponsiveContainer width="100%" height={220}>
            <RechartsPie>
              <Pie
                data={assetCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {assetCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RechartsPie>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {assetCategoryData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-white/60">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-white/80">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Residual Value & Profitability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Residual Value Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Residual Value Trend</h3>
              <p className="text-xs text-white/35 mt-0.5">Forecast vs Actual depreciation</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 bg-tvs-red rounded" />
                <span className="text-[10px] text-white/50">Forecast</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 bg-blue-400 rounded" />
                <span className="text-[10px] text-white/50">Actual</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={residualValueTrendData}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E31E24" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#E31E24" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="forecast" stroke="#E31E24" strokeWidth={2}
                fill="url(#forecastGrad)" dot={{ r: 3, fill: '#E31E24' }} />
              <Area type="monotone" dataKey="actual" stroke="#60A5FA" strokeWidth={2}
                fill="url(#actualGrad)" dot={{ r: 3, fill: '#60A5FA' }} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Profitability Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Portfolio Health</h3>
              <p className="text-xs text-white/35 mt-0.5">Profit vs Expected Loss trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={profitabilityTrendData}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E31E24" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#E31E24" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2}
                fill="url(#profitGrad)" name="Profit" />
              <Area type="monotone" dataKey="loss" stroke="#E31E24" strokeWidth={2}
                fill="url(#lossGrad)" name="Loss" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Assets Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="glass-card overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Assets</h3>
            <p className="text-xs text-white/35 mt-0.5">Latest analyzed portfolio entries</p>
          </div>
          <button className="btn-ghost text-xs py-2 px-4">
            View All <ChevronRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Asset ID', 'Model', 'Age', 'CIBIL', 'Risk Score', 'Risk Band', 'Profitability', 'LTV', 'Decision'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portfolioTableData
                .filter(row => searchQuery === '' || row.id.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.04 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5 text-xs font-semibold text-tvs-red">{row.id}</td>
                  <td className="px-5 py-3.5 text-xs text-white/70">{row.model}</td>
                  <td className="px-5 py-3.5 text-xs text-white/70">{row.age}</td>
                  <td className="px-5 py-3.5 text-xs text-white/70">{row.cibil === -1 ? 'N/A' : row.cibil}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${row.risk}%`,
                          background: row.risk > 60 ? '#E31E24' : row.risk > 50 ? '#F59E0B' : '#10B981'
                        }} />
                      </div>
                      <span className="text-xs font-semibold text-white/70">{row.risk}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      row.band === 'High' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                      row.band === 'Medium' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' :
                      'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {row.band}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-white/70">{row.profit}%</td>
                  <td className="px-5 py-3.5 text-xs text-white/70">{row.ltv}%</td>
                  <td className="px-5 py-3.5">
                    <span className={`${
                      row.decision === 'Approve' ? 'badge-approve' :
                      row.decision === 'Conditional' ? 'badge-conditional' :
                      'badge-reject'
                    }`}>
                      {row.decision}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
