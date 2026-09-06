import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Send, Bot, User, Shield, TrendingUp, AlertTriangle,
  CheckCircle, XCircle, Sparkles, RotateCcw, Copy, ThumbsUp,
  Clock, ChevronRight, Loader2
} from 'lucide-react'
import { assetDatabase, defaultAsset } from '../data/mockData'
import { useTheme } from '../App'
import MarkdownRenderer from '../components/common/MarkdownRenderer'

const quickQueries = [
  'Analyze risk for ASSET_1',
  'Why is this asset high risk?',
  'What actions can reduce risk?',
  'Why lower LTV?',
  'Compare ASSET_1 vs ASSET_2',
]

const initialMessages = [
  {
    role: 'assistant',
    content: `Welcome to the **AI Credit Copilot**. I'm your intelligent lending advisor powered by advanced ML models and LLM reasoning.

I can help you with:
- **Risk Assessment** — Analyze any asset's risk profile (ASSET_1, ASSET_2, ASSET_3)
- **Credit Decisions** — Get approval/rejection recommendations
- **Risk Explanations** — Understand what's driving the risk score
- **Mitigation Strategies** — Actionable steps to reduce exposure

Try asking "Analyze risk for ASSET_1" or follow-up questions like "Why is this asset high risk?"`,
    timestamp: '16:00',
  },
]

function extractAndNormalizeAssetId(text) {
  if (!text) return null
  const match = text.match(/(?:asset|ASSET)[\s_#]?(?:no\.?|num|number)?[\s_]?([1-9]\d*)/i)
  if (match) {
    return `ASSET_${match[1]}`
  }
  return null
}

function detectIntent(text) {
  const t = text.toLowerCase()
  if ((t.includes('why') || t.includes('reason')) && (t.includes('risk') || t.includes('classified') || t.includes('score') || t.includes('rating'))) {
    return 'WHY_RISK'
  }
  if (t.includes('high risk') || t.includes('classified as high risk')) {
    return 'WHY_RISK'
  }
  if (t.includes('ltv') && (t.includes('why') || t.includes('lower') || t.includes('reduce') || t.includes('recommending') || t.includes('recommend') || t.includes('ratio'))) {
    return 'WHY_LTV'
  }
  if (['action', 'reduce risk', 'mitigat', 'lower risk', 'lessen risk', 'decrease risk'].some(k => t.includes(k))) {
    return 'MITIGATION'
  }
  if (['profit', 'margin', 'return', 'gain', 'revenue'].some(k => t.includes(k))) {
    return 'PROFITABILITY'
  }
  if (['stress', 'shock', 'inflation', 'slowdown', 'scenario', 'perform under'].some(k => t.includes(k))) {
    return 'STRESS_TEST'
  }
  if (['compare', ' vs ', 'versus', 'difference'].some(k => t.includes(k))) {
    return 'COMPARE'
  }
  if (['analyze', 'analysis', 'evaluate', 'check', 'approve', 'review'].some(k => t.includes(k))) {
    return 'ANALYZE_RISK'
  }
  return 'GENERAL_QUERY'
}

function getAssetResponse(query, previousAssetId) {
  const explicitAsset = extractAndNormalizeAssetId(query)
  const current_asset = explicitAsset || previousAssetId
  const intent = detectIntent(query)

  console.log(`Current Asset: ${current_asset}`)
  console.log(`Detected Intent: ${intent}`)

  if (!current_asset) {
    return {
      content: `I'd be happy to help! Please specify an asset ID to analyze. Available assets: **ASSET_1**, **ASSET_2**, **ASSET_3**.`,
      assetId: null,
      asset: null,
      intent
    }
  }

  const asset = assetDatabase[current_asset] || null

  let responseContent = ""
  if (current_asset === 'ASSET_1') {
    if (intent === 'WHY_RISK') {
      responseContent = `ASSET_1 is classified as High Risk because:

- Missing CIBIL score
- Non-regular employment
- High residual value gap
- Risk score exceeds approval threshold`
    } else if (intent === 'MITIGATION') {
      responseContent = `For ASSET_1, risk can be reduced by:

- Increasing down payment
- Reducing LTV
- Adding co-signer
- Shortening tenure
- Comprehensive insurance`
    } else if (intent === 'WHY_LTV') {
      responseContent = `For ASSET_1, reducing LTV decreases lender exposure and expected loss because lower LTV provides a higher equity cushion against vehicle value depreciation and unhedged default risk.`
    } else if (intent === 'PROFITABILITY') {
      responseContent = `For ASSET_1:
- Profitability Score: **49.15/100**
- Expected Profit: **₹34,222**
- Margin Outlook: Viable return if recommended LTV (65%) and shortened tenure (18 months) are enforced.`
    } else if (intent === 'STRESS_TEST') {
      responseContent = `Stress Test Analysis for ASSET_1:
- **EV Market Shock**: Residual risk score increases to 68.30 (Expected profit: ₹28,900)
- **High Inflation**: Residual risk score increases to 64.80 (Expected profit: ₹31,500)
- **Economic Slowdown**: Residual risk score reaches 72.40 (Expected profit: ₹22,800)`
    } else {
      responseContent = asset ? asset.copilotText : `Analysis for **${current_asset}**`
    }
  } else if (current_asset === 'ASSET_2') {
    if (intent === 'WHY_RISK') {
      responseContent = `ASSET_2 is classified as Low Risk (Score: 53.94) because:

- Higher monthly salary (₹60,000)
- Newer asset age (0-1 Year)
- Moderate LTV ratio (78.4%)
- Favorable vehicle depreciation profile`
    } else if (intent === 'MITIGATION') {
      responseContent = `For ASSET_2, risk can be managed by:

- Standard monitoring protocol
- Quarterly check-in verification
- Maintaining LTV cap at 75%
- Automated NACH mandate`
    } else if (intent === 'WHY_LTV') {
      responseContent = `For ASSET_2, capping LTV at 75% maintains strong collateral coverage while accommodating a high-earning borrower.`
    } else if (intent === 'PROFITABILITY') {
      responseContent = `For ASSET_2:
- Profitability Score: **61.60/100**
- Expected Profit: **₹52,100**
- Margin Outlook: Highly profitable credit profile under standard terms.`
    } else if (intent === 'STRESS_TEST') {
      responseContent = `Stress Test Analysis for ASSET_2:
- **EV Market Shock**: Risk score 58.20
- **High Inflation**: Risk score 56.10
- **Economic Slowdown**: Risk score 62.40`
    } else {
      responseContent = asset ? asset.copilotText : `Analysis for **${current_asset}**`
    }
  } else if (current_asset === 'ASSET_3') {
    if (intent === 'WHY_RISK') {
      responseContent = `ASSET_3 is classified as Medium Risk (Score: 56.58) because:

- Strong CIBIL score (763) offsetting income variability
- Agricultural employment income fluctuation
- EV residual value market uncertainty`
    } else if (intent === 'MITIGATION') {
      responseContent = `For ASSET_3, risk can be reduced by:

- Mandatory comprehensive EV insurance
- Battery health certificate requirement
- Telematics battery health monitoring
- Capping LTV at 70%`
    } else if (intent === 'WHY_LTV') {
      responseContent = `For ASSET_3, reducing LTV to 70% protects against electric vehicle battery degradation and technological obsolescence.`
    } else if (intent === 'PROFITABILITY') {
      responseContent = `For ASSET_3:
- Profitability Score: **61.88/100**
- Expected Profit: **₹48,900**
- Margin Outlook: Solid return supported by high borrower credit score (763).`
    } else if (intent === 'STRESS_TEST') {
      responseContent = `Stress Test Analysis for ASSET_3:
- **EV Market Shock**: Risk score 64.10 (higher EV market sensitivity)
- **High Inflation**: Risk score 59.30
- **Economic Slowdown**: Risk score 66.80`
    } else {
      responseContent = asset ? asset.copilotText : `Analysis for **${current_asset}**`
    }
  } else if (intent === 'COMPARE') {
    responseContent = `**Asset Risk Comparison**:

- **ASSET_1**: High Risk (61.65) | Profitability: 49.15% | Decision: Approve with Conditions (25% down payment, co-signer required)
- **ASSET_2**: Low Risk (53.94) | Profitability: 61.60% | Decision: Approve standard terms
- **ASSET_3**: Medium Risk (56.58) | Profitability: 61.88% | Decision: Approve with EV insurance & battery check`
  } else {
    responseContent = asset ? asset.copilotText : `Analysis for **${current_asset}**`
  }

  return {
    content: responseContent,
    assetId: current_asset,
    asset: asset,
    intent
  }
}

export default function CopilotPage() {
  const { theme } = useTheme()
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentAssetId, setCurrentAssetId] = useState(null)
  const [activeAsset, setActiveAsset] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text) => {
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

    try {
      // Try fetching response from backend API endpoint first
      const res = await fetch('http://localhost:8000/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, session_id: 'default' }),
      })

      if (res.ok) {
        const data = await res.json()
        const targetAssetId = data.current_asset
        if (targetAssetId) {
          setCurrentAssetId(targetAssetId)
          if (assetDatabase[targetAssetId]) {
            setActiveAsset(assetDatabase[targetAssetId])
          }
        }
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          timestamp: timeStr,
        }])
        setIsTyping(false)
        return
      }
    } catch (e) {
      console.warn('[CopilotPage] Backend API chat call error, using local fallback:', e)
    }

    // Fallback to client-side engine with conversational memory
    setTimeout(() => {
      const response = getAssetResponse(msg, currentAssetId)
      if (response.assetId) {
        setCurrentAssetId(response.assetId)
        if (response.asset) setActiveAsset(response.asset)
        else if (assetDatabase[response.assetId]) setActiveAsset(assetDatabase[response.assetId])
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.content,
        timestamp: timeStr,
      }])
      setIsTyping(false)
    }, 400)
  }

  return (
    <div className="flex h-full bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-header)] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-r from-tvs-red to-tvs-red-dark">
              <Brain size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">AI Credit Copilot</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-500 font-medium">Online — llama3-70b-8192 + XGBoost + Catboost</span>
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
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1 bg-tvs-red/15 border border-tvs-red/25">
                  <Bot size={14} className="text-tvs-red" />
                </div>
              )}
              <div className={`max-w-[70%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-tvs-red/20 text-[var(--text-primary)] border border-tvs-red/30 rounded-br-md font-medium'
                    : 'glass-card !rounded-bl-md text-[var(--text-primary)] hover:transform-none'
                  }`} style={msg.role === 'assistant' ? { transform: 'none' } : {}}>
                  <MarkdownRenderer content={msg.content} />
                </div>
                <div className="flex items-center gap-3 mt-1.5 px-1">
                  <span className="text-[10px] text-[var(--text-muted)]">{msg.timestamp}</span>
                  {msg.role === 'assistant' && i > 0 && (
                    <div className="flex items-center gap-2">
                      <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        <Copy size={10} />
                      </button>
                      <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        <ThumbsUp size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1 bg-blue-500/15 border border-blue-500/25">
                  <User size={14} className="text-blue-500" />
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
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-tvs-red/15 border border-tvs-red/25">
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
                <span className="text-xs text-[var(--text-muted)]">Analyzing...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="flex-shrink-0 px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-[var(--border-subtle)]">
          {quickQueries.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold text-[var(--text-secondary)] bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-tvs-red/40 transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-4 border-t border-[var(--border-subtle)]">
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
      <div className="hidden lg:flex flex-col w-80 border-l border-[var(--border-subtle)] overflow-y-auto bg-[var(--bg-sidebar)] transition-colors duration-300">
        <div className="p-5 border-b border-[var(--border-subtle)]">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">Credit Decision Panel</h4>
          <p className="text-[10px] text-[var(--text-muted)]">
            {activeAsset ? `Showing analysis for ${activeAsset.agmtId}` : 'Ask about an asset to see details'}
          </p>
        </div>

        {activeAsset ? (
          <div className="p-5 space-y-5">
            {/* Decision Badge */}
            <div className="text-center py-4">
              <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold ${activeAsset.decision === 'APPROVE'
                  ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/25'
                  : activeAsset.decision.includes('CONDITION')
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/25'
                    : 'bg-tvs-red/15 text-tvs-red border border-tvs-red/25'
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
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)]">
                  <span className="text-xs text-[var(--text-muted)]">{m.label}</span>
                  <span className="text-sm font-bold" style={{ color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Risk Drivers */}
            <div className="space-y-2">
              <div className="section-label">Risk Drivers</div>
              {activeAsset.riskDrivers.map((d, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-tvs-red/10 border border-tvs-red/20">
                  <AlertTriangle size={11} className="text-tvs-red flex-shrink-0" />
                  <span className="text-[11px] text-[var(--text-primary)] font-medium">{d}</span>
                </div>
              ))}
            </div>

            {/* Recommended Actions */}
            <div className="space-y-2">
              <div className="section-label">Recommended Actions</div>
              {activeAsset.mitigations.map((m, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle size={11} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-[11px] text-[var(--text-primary)] font-medium">{m}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-tvs-red/10 border border-tvs-red/20">
              <Sparkles size={24} className="text-tvs-red/60" />
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Ask the AI Copilot about an asset to see the credit decision panel with risk metrics and recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
