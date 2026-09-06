import { Bell, Search, Sun, Moon, User, ChevronDown, Wifi } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../App'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Portfolio overview and key metrics' },
  '/risk': { title: 'Asset Analysis', subtitle: 'Search and analyze individual assets' },
  '/copilot': { title: 'AI Credit Copilot', subtitle: 'LLM-powered lending recommendations' },
  '/scenarios': { title: 'Scenario Simulator', subtitle: 'Market shock stress testing' },
  '/portfolio': { title: 'Portfolio Digital Twin', subtitle: 'Enterprise-wide risk intelligence' },
  '/downloads': { title: 'Download Center', subtitle: 'Reports and data exports' },
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState(3)
  const [showNotif, setShowNotif] = useState(false)
  const location = useLocation()
  const page = pageTitles[location.pathname] || { title: 'TVS RiskIQ', subtitle: '' }

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-6 h-16 bg-[var(--bg-header)] backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors duration-300">
      {/* Page title */}
      <div>
        <h1 className="text-base font-bold text-[var(--text-primary)]">{page.title}</h1>
        <p className="text-xs text-[var(--text-muted)] font-medium">{page.subtitle}</p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-500 text-[11px] font-semibold">LIVE</span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-tvs-red/40"
        >
          <AnimatePresence mode="wait">
            <motion.div key={theme}
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-tvs-red" />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-tvs-red/40"
          >
            <Bell size={16} className="text-[var(--text-secondary)]" />
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
                className="absolute right-0 top-12 w-72 rounded-xl overflow-hidden z-50 bg-[var(--bg-modal)] border border-[var(--border-subtle)] shadow-2xl"
              >
                <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                  <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Alerts</span>
                </div>
                {[
                  { text: 'ASSET_47 flagged — High risk threshold breached', time: '2m ago', dot: '#E31E24' },
                  { text: 'Portfolio EV shock simulation complete', time: '18m ago', dot: '#3B82F6' },
                  { text: 'AI Copilot batch analysis: 50 assets', time: '1h ago', dot: '#10B981' },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--table-row-hover)] transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.dot }} />
                    <div>
                      <p className="text-xs text-[var(--text-primary)] leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all bg-[var(--bg-card)] border border-[var(--border-subtle)]">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-r from-tvs-red to-tvs-red-dark">
            <User size={12} className="text-white" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-semibold text-[var(--text-primary)]">Risk Officer</div>
            <div className="text-[9px] text-[var(--text-muted)]">TVS Credit</div>
          </div>
          <ChevronDown size={12} className="text-[var(--text-muted)] hidden sm:block" />
        </button>
      </div>
    </header>
  )
}
