import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Activity, Brain, Shield, Zap, BarChart3, ArrowRight,
  TrendingUp, ChevronRight, Sparkles
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Risk Intelligence',
    desc: 'Real-time residual risk scoring powered by gradient-boosted ML models across 10+ asset features.',
    color: '#E31E24',
  },
  {
    icon: Brain,
    title: 'AI Credit Copilot',
    desc: 'LLM-powered lending advisor delivering natural-language credit decisions with explainable reasoning.',
    color: '#3B82F6',
  },
  {
    icon: Zap,
    title: 'Scenario Simulator',
    desc: 'Stress-test portfolios against EV shocks, inflation spikes, and economic slowdowns in real-time.',
    color: '#F59E0B',
  },
  {
    icon: BarChart3,
    title: 'Portfolio Digital Twin',
    desc: 'Enterprise-wide risk visualization with regional heat maps and asset segmentation analytics.',
    color: '#10B981',
  },
]

const stats = [
  { value: '₹1,247 Cr', label: 'Portfolio AUM' },
  { value: '94.2%', label: 'Model Accuracy' },
  { value: '23%', label: 'Risk Reduction' },
  { value: '<200ms', label: 'Decision Latency' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(227,30,36,0.3) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)' }} />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #E31E24, #B91519)' }}>
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-wide">TVS RiskTwin</span>
            <div className="text-[10px] text-white/40 font-medium tracking-widest uppercase">Credit Intelligence</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary text-white text-sm"
        >
          Launch Platform
          <ArrowRight size={16} />
        </button>
      </motion.nav>

      {/* Hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(227,30,36,0.1)', border: '1px solid rgba(227,30,36,0.2)' }}
          >
            <Sparkles size={14} className="text-tvs-red" />
            <span className="text-xs font-semibold text-tvs-red">AI-Powered Vehicle Financing Intelligence</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="gradient-text">Smarter Lending.</span>
            <br />
            <span className="gradient-text-red">Lower Risk.</span>
          </h1>

          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            TVS RiskTwin combines advanced ML models, explainable AI, and real-time portfolio analytics
            to transform vehicle financing decisions across India's two-wheeler market.
          </p>

          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard')}
              className="btn-primary text-white px-8 py-4 text-base"
            >
              Enter Dashboard
              <ChevronRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/portfolio')}
              className="btn-ghost px-8 py-4 text-base"
            >
              View Portfolio
            </motion.button>
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
              className="text-center py-4"
            >
              <div className="text-2xl md:text-3xl font-bold gradient-text-red">{s.value}</div>
              <div className="text-xs text-white/40 font-medium mt-1">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-20">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed">{f.desc}</p>
              <div className="flex items-center gap-1 mt-4 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: f.color }}>
                Explore <ArrowRight size={12} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-24 pb-10"
        >
          <p className="text-xs text-white/30 font-medium tracking-wider uppercase">
            Built for TVS Credit Services · Hackathon 2026
          </p>
        </motion.div>
      </div>
    </div>
  )
}
