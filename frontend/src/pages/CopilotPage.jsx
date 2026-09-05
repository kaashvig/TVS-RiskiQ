import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Send, Bot, User, Shield, TrendingUp, AlertTriangle,
  CheckCircle, XCircle, Sparkles, RotateCcw, Copy, ThumbsUp,
  Clock, ChevronRight, Loader2
} from 'lucide-react'
import { assetDatabase, defaultAsset } from '../data/mockData'

const quickQueries = [
  'Analyze risk for ASSET_1',
  'Should we approve ASSET_2?',
  'What mitigations for ASSET_3?',
  'Compare ASSET_1 vs ASSET_2',
]

const initialMessages = [
  {
    role: 'assistant',
    content: `Welcome to the **AI Credit Copilot**. I'm your intelligent lending advisor powered by advanced ML models and LLM reasoning.

I can help you with:
- **Risk Assessment** — Analyze any asset's risk profile
- **Credit Decisions** — Get approval/rejection recommendations
- **Risk Explanations** — Understand what's driving the risk score
- **Mitigation Strategies** — Actionable steps to reduce exposure

Try asking about any asset (ASSET_1, ASSET_2, or ASSET_3) to get started.`,
    timestamp: '16:00',
  },
]

function getAssetResponse(query) {
  const upperQuery = query.toUpperCase()
  let assetId = null
  if (upperQuery.includes('ASSET_1')) assetId = 'ASSET_1'
  else if (upperQuery.includes('ASSET_2')) assetId = 'ASSET_2'
  else if (upperQuery.includes('ASSET_3')) assetId = 'ASSET_3'

  if (!assetId) {
    return {
      content: `I'd be happy to help! Please specify an asset ID to analyze. Available assets: **ASSET_1**, **ASSET_2**, **ASSET_3**.

Each analysis includes:
- Residual risk score & risk band
- Profitability assessment
- Credit decision recommendation
- Actionable mitigation strategies`,
      asset: null,
    }
  }

  const asset = assetDatabase[assetId]
  return {
    content: asset.copilotText,
    asset,
  }
}

export default function CopilotPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeAsset, setActiveAsset] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (text) => {
    const msg = text || input
    if (!msg.trim()) return

    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`

    setMessages(prev => [...prev, {
      role: 'user',
      content: msg,
      timestamp: timeStr,
    }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = getAssetResponse(msg)
      if (response.asset) setActiveAsset(response.asset)

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.content,
        timestamp: timeStr,
      }])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="flex h-full bg-dark-950">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-white/5"
          style={{ background: 'rgba(10,10,15,0.6)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E31E24, #B91519)' }}>
              <Brain size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Credit Copilot</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-medium">Online — llama3-70b-8192 + XGBoost + Catboost</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1"
                  style={{ background: 'rgba(227,30,36,0.15)', border: '1px solid rgba(227,30,36,0.2)' }}>
                  <Bot size={14} className="text-tvs-red" />
                </div>
              )}
              <div className={`max-w-[70%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-tvs-red/20 text-white/90 border border-tvs-red/20 rounded-br-md'
                    : 'glass-card !rounded-bl-md text-white/80 hover:transform-none'
                  }`} style={msg.role === 'assistant' ? { transform: 'none' } : {}}>
                  {msg.content.split('\n').map((line, li) => (
                    <p key={li} className={li > 0 ? 'mt-2' : ''}>
                      {line.split(/(\*\*.*?\*\*)/).map((part, pi) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={pi} className="text-white font-semibold">{part.slice(2, -2)}</strong>
                        }
                        return <span key={pi}>{part}</span>
                      })}
                    </p>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-1.5 px-1">
                  <span className="text-[10px] text-white/25">{msg.timestamp}</span>
                  {msg.role === 'assistant' && i > 0 && (
                    <div className="flex items-center gap-2">
                      <button className="text-white/20 hover:text-white/50 transition-colors">
                        <Copy size={10} />
                      </button>
                      <button className="text-white/20 hover:text-white/50 transition-colors">
                        <ThumbsUp size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1"
                  style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <User size={14} className="text-blue-400" />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(227,30,36,0.15)', border: '1px solid rgba(227,30,36,0.2)' }}>
                <Bot size={14} className="text-tvs-red" />
              </div>
              <div className="glass-card px-4 py-3 flex items-center gap-2" style={{ transform: 'none' }}>
                <motion.div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-tvs-red"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </motion.div>
                <span className="text-xs text-white/40">Analyzing...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="flex-shrink-0 px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
          {quickQueries.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/50 hover:text-white/80 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-4 border-t border-white/5">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ask the AI Copilot about any asset..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="input-dark pr-4 w-full"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend()}
              className="btn-primary text-white px-5"
              disabled={!input.trim() || isTyping}
            >
              <Send size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Right Panel — Credit Decision */}
      <div className="hidden lg:flex flex-col w-80 border-l border-white/5 overflow-y-auto"
        style={{ background: 'rgba(10,10,15,0.5)' }}>
        <div className="p-5 border-b border-white/5">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Credit Decision Panel</h4>
          <p className="text-[10px] text-white/25">
            {activeAsset ? `Showing analysis for ${activeAsset.agmtId}` : 'Ask about an asset to see details'}
          </p>
        </div>

        {activeAsset ? (
          <div className="p-5 space-y-5">
            {/* Decision Badge */}
            <div className="text-center py-4">
              <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold ${activeAsset.decision === 'APPROVE'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : activeAsset.decision.includes('CONDITION')
                    ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25'
                    : 'bg-red-500/15 text-red-400 border border-red-500/25'
                }`}>
                {activeAsset.decision === 'APPROVE' ? <CheckCircle size={16} /> :
                  activeAsset.decision.includes('CONDITION') ? <AlertTriangle size={16} /> :
                    <XCircle size={16} />}
                {activeAsset.decision}
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="space-y-3">
              <div className="section-label">Risk Metrics</div>
              {[
                { label: 'Risk Score', value: activeAsset.residualRiskScore.toFixed(1), color: activeAsset.riskBand === 'High' ? '#E31E24' : activeAsset.riskBand === 'Medium' ? '#F59E0B' : '#10B981' },
                { label: 'Profitability', value: `${activeAsset.profitabilityScore.toFixed(1)}%`, color: '#3B82F6' },
                { label: 'LGD', value: `${activeAsset.lgdPct}%`, color: '#F59E0B' },
                { label: 'LTV', value: `${activeAsset.ltv}%`, color: '#E31E24' },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-xs text-white/50">{m.label}</span>
                  <span className="text-sm font-bold" style={{ color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Risk Drivers */}
            <div className="space-y-2">
              <div className="section-label">Risk Drivers</div>
              {activeAsset.riskDrivers.map((d, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg"
                  style={{ background: 'rgba(227,30,36,0.05)', border: '1px solid rgba(227,30,36,0.1)' }}>
                  <AlertTriangle size={11} className="text-tvs-red flex-shrink-0" />
                  <span className="text-[11px] text-white/60">{d}</span>
                </div>
              ))}
            </div>

            {/* Recommended Actions */}
            <div className="space-y-2">
              <div className="section-label">Recommended Actions</div>
              {activeAsset.mitigations.map((m, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg"
                  style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
                  <CheckCircle size={11} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-[11px] text-white/60">{m}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(227,30,36,0.1)', border: '1px solid rgba(227,30,36,0.15)' }}>
              <Sparkles size={24} className="text-tvs-red/50" />
            </div>
            <p className="text-xs text-white/30 leading-relaxed">
              Ask the AI Copilot about an asset to see the credit decision panel with risk metrics and recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
