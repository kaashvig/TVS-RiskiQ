import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Brain, TrendingUp, Zap, BarChart3,
  Download, ChevronRight, Activity, Shield
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', sub: 'Overview & KPIs' },
  { to: '/risk', icon: Shield, label: 'Asset Analysis', sub: 'Search & Analyze' },
  { to: '/copilot', icon: Brain, label: 'AI Copilot', sub: 'LLM Recommendations' },
  { to: '/scenarios', icon: Zap, label: 'Scenario Sim', sub: 'Shock Testing' },
  { to: '/portfolio', icon: BarChart3, label: 'Portfolio Twin', sub: 'Digital Twin View' },
  { to: '/downloads', icon: Download, label: 'Downloads', sub: 'Reports & Export' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex-shrink-0 h-full flex flex-col overflow-hidden bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] transition-colors duration-300"
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border-subtle)]">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-r from-tvs-red to-tvs-red-dark">
          <Activity size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm font-bold tracking-wide text-[var(--text-primary)]">TVS RiskTwin</div>
              <div className="text-[10px] text-[var(--text-muted)] font-medium tracking-wider uppercase">Credit Intelligence</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 mb-3"
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                Navigation
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <NavLink key={item.to} to={item.to}>
              <motion.div
                className={clsx(
                  'sidebar-item group relative',
                  isActive && 'active'
                )}
                whileHover={{ x: collapsed ? 0 : 2 }}
                transition={{ duration: 0.15 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-tvs-red rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon size={18} className={clsx('flex-shrink-0', isActive ? 'text-tvs-red' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]')} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 min-w-0"
                    >
                      <div className="text-sm font-medium leading-tight text-[var(--text-primary)]">{item.label}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{item.sub}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!collapsed && isActive && (
                  <ChevronRight size={14} className="text-[var(--text-muted)] flex-shrink-0" />
                )}
              </motion.div>
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--table-row-hover)] transition-all text-xs font-medium"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronRight size={16} />
          </motion.div>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  )
}
