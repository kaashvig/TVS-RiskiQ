import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, TrendingUp, TrendingDown, ArrowRight,
  Shield, DollarSign, AlertTriangle, BarChart3,
  ChevronRight, Battery, Flame, LineChart
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from 'recharts'
import { scenarioData } from '../data/mockData'
import { useTheme } from '../App'

const scenarios = [
  { key: 'ev_shock', icon: Battery, label: 'EV Market Shock', emoji: '⚡' },
  { key: 'high_inflation', icon: Flame, label: 'Inflation Surge', emoji: '🔥' },
  { key: 'slowdown', icon: TrendingDown, label: 'Economic Slowdown', emoji: '📉' },
]

const MetricCard = ({ label, baseValue, scenarioValue, delta, format, isPositiveGood = true }) => {
  const improved = isPositiveGood ? delta >= 0 : delta <= 0
  return (
    <div className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)]">
      <div className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-3">{label}</div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] text-[var(--text-muted)] mb-1">Base</div>
          <div className="text-lg font-bold text-[var(--text-secondary)]">{format(baseValue)}</div>
        </div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
        >
          <ArrowRight size={16} className="text-[var(--text-muted)] mx-2" />
        </motion.div>
        <div className="text-right">
          <div className="text-[10px] text-[var(--text-muted)] mb-1">Stressed</div>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            className={`text-lg font-bold ${improved ? 'text-emerald-500' : 'text-tvs-red'}`}
          >
            {format(scenarioValue)}
          </motion.div>
        </div>
      </div>
      {delta !== undefined && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-3 pt-2 border-t border-[var(--border-subtle)]"
        >
          <div className={`flex items-center gap-1 text-xs font-semibold ${improved ? 'text-emerald-500' : 'text-tvs-red'}`}>
            {improved ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {delta > 0 ? '+' : ''}{typeof delta === 'number' && delta < 100 && delta > -100
              ? delta.toFixed(1)
              : delta?.toLocaleString?.() || delta}
          </div>
        </motion.div>
      )}
    </div>
  )
}

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
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ScenarioPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeScenario, setActiveScenario] = useState('ev_shock')
  const base = scenarioData.base
  const scenario = scenarioData[activeScenario]

  const axisColor = isDark ? 'rgba(255,255,255,0.6)' : '#475569'

  const comparisonData = [
    { metric: 'Residual Value', base: base.residualValue, stressed: scenario.residualValue },
    { metric: 'Risk Score', base: base.riskScore, stressed: scenario.riskScore },
    { metric: 'Expected Profit', base: base.expectedProfit, stressed: scenario.expectedProfit },
    { metric: 'LGD %', base: base.lgdPct, stressed: scenario.lgdPct },
    { metric: 'LTV %', base: base.ltv, stressed: scenario.ltv },
  ]

  const radarData = [
    { subject: 'Residual Value', base: 80, stressed: Math.round(80 * (scenario.residualValue / base.residualValue)) },
    { subject: 'Risk Score', base: 60, stressed: Math.round(60 * (scenario.riskScore / base.riskScore)) },
    { subject: 'Profitability', base: 75, stressed: Math.round(75 * (scenario.expectedProfit / base.expectedProfit)) },
    { subject: 'LGD', base: 40, stressed: Math.round(40 * (scenario.lgdPct / base.lgdPct)) },
    { subject: 'LTV', base: 50, stressed: Math.round(50 * (scenario.ltv / base.ltv)) },
  ]

  return (
    <div className="p-6 space-y-6 min-h-full bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Scenario Simulator</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">Stress-test portfolio against market shocks & macro events</p>
      </motion.div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {scenarios.map((s, i) => (
          <motion.button
            key={s.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveScenario(s.key)}
            className={`relative glass-card p-5 text-left transition-all ${
              activeScenario === s.key ? '!border-tvs-red/40 !bg-tvs-red/[0.08]' : ''
            }`}
            style={activeScenario === s.key ? { transform: 'none' } : {}}
          >
            {activeScenario === s.key && (
              <motion.div
                layoutId="scenarioIndicator"
                className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-tvs-red to-tvs-red-light rounded-t-2xl"
              />
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{
                  background: `${scenarioData[s.key].color}15`,
                  border: `1px solid ${scenarioData[s.key].color}25`
                }}>
                {s.emoji}
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">{s.label}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{scenarioData[s.key].description.slice(0, 50)}...</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs font-semibold text-tvs-red">
                Risk: +{scenarioData[s.key].deltaRisk?.toFixed(1)}
              </div>
              <span className="text-[var(--text-muted)]">|</span>
              <div className="text-xs font-semibold text-[var(--text-muted)]">
                ₹{Math.abs(scenarioData[s.key].deltaProfit || 0).toLocaleString()} loss
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Scenario Detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Scenario Description */}
          <div className="glass-card p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${scenario.color}15`, border: `1px solid ${scenario.color}25` }}>
                <Zap size={20} style={{ color: scenario.color }} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{scenario.label}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{scenario.description}</p>
              </div>
            </div>
          </div>

          {/* Before/After Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard
              label="Residual Value"
              baseValue={base.residualValue}
              scenarioValue={scenario.residualValue}
              delta={scenario.deltaResidual}
              format={v => `₹${v.toLocaleString()}`}
              isPositiveGood={true}
            />
            <MetricCard
              label="Risk Score"
              baseValue={base.riskScore}
              scenarioValue={scenario.riskScore}
              delta={scenario.deltaRisk}
              format={v => v.toFixed(1)}
              isPositiveGood={false}
            />
            <MetricCard
              label="Expected Profit"
              baseValue={base.expectedProfit}
              scenarioValue={scenario.expectedProfit}
              delta={scenario.deltaProfit}
              format={v => `₹${v.toLocaleString()}`}
              isPositiveGood={true}
            />
            <MetricCard
              label="LGD %"
              baseValue={base.lgdPct}
              scenarioValue={scenario.lgdPct}
              delta={scenario.lgdPct - base.lgdPct}
              format={v => `${v.toFixed(1)}%`}
              isPositiveGood={false}
            />
            <MetricCard
              label="LTV %"
              baseValue={base.ltv}
              scenarioValue={scenario.ltv}
              delta={scenario.ltv - base.ltv}
              format={v => `${v.toFixed(1)}%`}
              isPositiveGood={false}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Radar Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-5"
            >
              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">Impact Radar</h4>
              <p className="text-xs text-[var(--text-muted)] mb-4">Multi-dimensional stress impact visualization</p>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: axisColor, fontSize: 10 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar name="Base" dataKey="base" stroke="#6B7280" fill="#6B7280" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="Stressed" dataKey="stressed" stroke={scenario.color} fill={scenario.color} fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip content={<CustomTooltip isDark={isDark} />} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-gray-500 rounded" />
                  <span className="text-[10px] text-[var(--text-muted)]">Base Case</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 rounded" style={{ background: scenario.color }} />
                  <span className="text-[10px] text-[var(--text-muted)]">Stressed</span>
                </div>
              </div>
            </motion.div>

            {/* Comparison Bars */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-5"
            >
              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">Side-by-Side Comparison</h4>
              <p className="text-xs text-[var(--text-muted)] mb-4">Base case vs stressed scenario metrics</p>
              <div className="space-y-4">
                {comparisonData.map((item, i) => {
                  const maxVal = Math.max(item.base, item.stressed)
                  const baseWidth = (item.base / maxVal) * 100
                  const stressedWidth = (item.stressed / maxVal) * 100
                  const isWorse = item.metric === 'Risk Score' || item.metric === 'LGD %' || item.metric === 'LTV %'
                    ? item.stressed > item.base
                    : item.stressed < item.base

                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-[var(--text-secondary)] font-medium">{item.metric}</span>
                        <span className={`text-xs font-semibold ${isWorse ? 'text-tvs-red' : 'text-emerald-500'}`}>
                          {item.metric.includes('Value') || item.metric.includes('Profit')
                            ? `₹${item.stressed.toLocaleString()}`
                            : `${item.stressed.toFixed(1)}${item.metric.includes('%') ? '%' : ''}`}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-[var(--text-muted)] w-10">Base</span>
                          <div className="flex-1 h-2 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${baseWidth}%` }}
                              transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                              className="h-full rounded-full bg-gray-500/50"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-[var(--text-muted)] w-10">Stress</span>
                          <div className="flex-1 h-2 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${stressedWidth}%` }}
                              transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                              className="h-full rounded-full"
                              style={{ background: isWorse ? '#E31E24' : '#10B981' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Impact Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card-red p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-tvs-red" />
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Stress Test Summary</h4>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Under the <strong className="text-[var(--text-primary)]">{scenario.label}</strong> scenario, the portfolio would experience
              a <strong className="text-tvs-red">₹{Math.abs(scenario.deltaResidual || 0).toLocaleString()}</strong> decline
              in residual value with risk scores increasing by <strong className="text-tvs-red">+{scenario.deltaRisk?.toFixed(1)} points</strong>.
              Expected profit would decrease by <strong className="text-tvs-red">₹{Math.abs(scenario.deltaProfit || 0).toLocaleString()}</strong>,
              requiring portfolio rebalancing and enhanced monitoring of high-exposure segments.
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
