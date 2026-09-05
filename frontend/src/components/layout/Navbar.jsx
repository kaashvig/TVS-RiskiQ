import { Bell, Search, Sun, Moon, User, ChevronDown, Wifi } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../App'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/dashboard': { title: 'Asset Analysis', subtitle: 'Search and analyze individual assets' },
  '/risk': { title: 'Risk Intelligence', subtitle: 'SHAP explanations and risk scoring' },
  '/copilot': { title: 'AI Credit Copilot', subtitle: 'LLM-powered lending recommendations' },
  '/scenarios': { title: 'Scenario Simulation', subtitle: 'Market shock stress testing' },
  '/portfolio': { title: 'Executive Portfolio', subtitle: 'Enterprise-wide risk overview' },
  '/downloads': { title: 'Download Center', subtitle: 'Reports and data exports' },
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState(3)
  const [showNotif, setShowNotif] = useState(false)
  const location = useLocation()
  const page = pageTitles[location.pathname] || { title: 'TVS PRISM', subtitle: '' }

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-6 h-16"
      style={{
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
      {/* Page title */}
      <div>
        <h1 className="text-base font-bold text-white">{page.title}</h1>
        <p className="text-xs text-white/40 font-medium">{page.subtitle}</p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-[11px] font-semibold">LIVE</span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div key={theme}
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun size={16} className="text-white/60" /> : <Moon size={16} className="text-white/60" />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Bell size={16} className="text-white/60" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-tvs-red flex items-center justify-center text-[9px] font-bold text-white">
                {notifications}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-72 rounded-xl overflow-hidden z-50"
                style={{ background: '#18181F', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
              >
                <div className="px-4 py-3 border-b border-white/5">
                  <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Alerts</span>
                </div>
                {[
                  { text: 'ASSET_47 flagged — High risk threshold breached', time: '2m ago', dot: '#E31E24' },
                  { text: 'Portfolio EV shock simulation complete', time: '18m ago', dot: '#3B82F6' },
                  { text: 'AI Copilot batch analysis: 50 assets', time: '1h ago', dot: '#10B981' },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/05 transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.dot }} />
                    <div>
                      <p className="text-xs text-white/80 leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-white/30 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #E31E24, #B91519)' }}>
            <User size={12} className="text-white" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-semibold text-white">Risk Officer</div>
            <div className="text-[9px] text-white/40">TVS Credit</div>
          </div>
          <ChevronDown size={12} className="text-white/40 hidden sm:block" />
        </button>
      </div>
    </header>
  )
}
