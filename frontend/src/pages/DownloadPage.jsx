import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download, FileText, FileSpreadsheet, BarChart3,
  Calendar, Clock, Check, ChevronRight, Loader2
} from 'lucide-react'
import { useTheme } from '../App'
import { downloadCreditReport } from '../utils/reportDownloader'

const reports = [
  {
    id: 'ASSET_1',
    title: 'Portfolio Risk Summary Report',
    description: 'Complete portfolio analysis with risk distribution, regional breakdown, and asset performance metrics.',
    type: 'PDF',
    icon: FileText,
    size: '2.4 MB',
    date: 'Sep 5, 2026',
    color: '#E31E24',
  },
  {
    id: 'ASSET_2',
    title: 'Asset-Level Risk Scores',
    description: 'Detailed risk scores, SHAP explanations, and credit decisions for all analyzed assets.',
    type: 'XLSX',
    icon: FileSpreadsheet,
    size: '1.8 MB',
    date: 'Sep 5, 2026',
    color: '#10B981',
  },
  {
    id: 'ASSET_3',
    title: 'Scenario Stress Test Results',
    description: 'Comparative analysis across EV shock, inflation, and economic slowdown scenarios.',
    type: 'PDF',
    icon: BarChart3,
    size: '3.1 MB',
    date: 'Sep 4, 2026',
    color: '#3B82F6',
  },
  {
    id: 'ASSET_1',
    title: 'AI Copilot Decision Log',
    description: 'Complete audit trail of all AI-generated credit decisions with reasoning and confidence scores.',
    type: 'CSV',
    icon: FileSpreadsheet,
    size: '890 KB',
    date: 'Sep 4, 2026',
    color: '#F59E0B',
  },
  {
    id: 'ASSET_2',
    title: 'Regional Performance Report',
    description: 'State-wise risk distribution, asset concentration, and branch performance analysis.',
    type: 'PDF',
    icon: FileText,
    size: '1.5 MB',
    date: 'Sep 3, 2026',
    color: '#8B5CF6',
  },
  {
    id: 'ASSET_3',
    title: 'Residual Value Forecast Data',
    description: 'ML-generated residual value predictions for all asset categories across time horizons.',
    type: 'XLSX',
    icon: FileSpreadsheet,
    size: '2.2 MB',
    date: 'Sep 3, 2026',
    color: '#06B6D4',
  },
]

export default function DownloadPage() {
  const { theme } = useTheme()
  const [downloadingId, setDownloadingId] = useState(null)

  const handleDownload = async (assetId) => {
    setDownloadingId(assetId)
    await downloadCreditReport(assetId)
    setDownloadingId(null)
  }

  return (
    <div className="p-6 space-y-6 min-h-full bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Download Center</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">Export reports, analytics data, and model outputs</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Generate Full Report', sub: 'PDF with all modules', icon: FileText, color: '#E31E24', assetId: 'ASSET_1' },
          { label: 'Export Raw Data', sub: 'XLSX/CSV formats', icon: FileSpreadsheet, color: '#10B981', assetId: 'ASSET_2' },
          { label: 'Schedule Report', sub: 'Weekly/Monthly auto', icon: Calendar, color: '#3B82F6', assetId: 'ASSET_3' },
        ].map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDownload(action.assetId)}
            className="glass-card p-5 text-left flex items-center gap-4 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${action.color}15`, border: `1px solid ${action.color}25` }}>
              <action.icon size={18} style={{ color: action.color }} />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text-primary)]">{action.label}</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{action.sub}</div>
            </div>
            <ChevronRight size={16} className="text-[var(--text-muted)] ml-auto" />
          </motion.button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        <div className="section-label px-1">Available Reports</div>
        {reports.map((report, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            className="glass-card p-5 flex items-center gap-5 group"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${report.color}12`, border: `1px solid ${report.color}20` }}>
              <report.icon size={20} style={{ color: report.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-[var(--text-primary)] mb-0.5">{report.title}</div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{report.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold tracking-wider"
                  style={{ background: `${report.color}15`, color: report.color }}>
                  {report.type}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                  <Clock size={9} /> {report.date}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">{report.size}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDownload(report.id)}
              disabled={downloadingId === report.id}
              className="btn-ghost !px-4 !py-2 text-xs flex items-center gap-2 cursor-pointer"
            >
              {downloadingId === report.id ? (
                <Loader2 size={14} className="animate-spin text-tvs-red" />
              ) : (
                <Download size={14} />
              )}
              <span>{downloadingId === report.id ? 'Generating...' : 'Download'}</span>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
