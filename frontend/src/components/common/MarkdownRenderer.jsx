import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AlertTriangle, CheckCircle, XCircle, Shield, Info } from 'lucide-react'

function renderBadge(text) {
  const upper = text.toUpperCase()
  if (upper.includes('APPROVE') && !upper.includes('CONDITION')) {
    return (
      <span className="badge-approve inline-flex items-center gap-1">
        <CheckCircle size={12} /> {text}
      </span>
    )
  }
  if (upper.includes('CONDITION') || upper.includes('MEDIUM')) {
    return (
      <span className="badge-conditional inline-flex items-center gap-1">
        <AlertTriangle size={12} /> {text}
      </span>
    )
  }
  if (upper.includes('REJECT') || upper.includes('HIGH') || upper.includes('RISK SCORE')) {
    return (
      <span className="badge-reject inline-flex items-center gap-1">
        <XCircle size={12} /> {text}
      </span>
    )
  }
  return text
}

export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null

  return (
    <div className={`markdown-content space-y-3 text-xs leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base font-extrabold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2 mt-4 mb-2 flex items-center gap-2">
              <Shield size={16} className="text-tvs-red" />
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold text-tvs-red tracking-wide border-b border-tvs-red/20 pb-1 mt-3 mb-2 flex items-center gap-1.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-bold uppercase tracking-wider text-tvs-red mt-3 mb-1">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed my-1.5">
              {children}
            </p>
          ),
          strong: ({ children }) => {
            const textContent = String(children)
            if (['APPROVE', 'APPROVE WITH CONDITIONS', 'REJECT', 'HIGH RISK', 'MEDIUM RISK', 'LOW RISK'].includes(textContent.toUpperCase())) {
              return renderBadge(textContent)
            }
            return <strong className="font-bold text-[var(--text-primary)]">{children}</strong>
          },
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2 pl-4 list-disc marker:text-tvs-red text-xs text-[var(--text-secondary)]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-2 pl-4 list-decimal marker:text-tvs-red text-xs text-[var(--text-secondary)]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 text-xs text-[var(--text-secondary)] leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="p-3 my-2 rounded-xl bg-tvs-red/10 border-l-4 border-tvs-red text-xs text-[var(--text-primary)] font-medium">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-xl border border-[var(--border-subtle)] shadow-sm">
              <table className="w-full text-xs text-left border-collapse bg-[var(--bg-card)]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[var(--table-header-bg)] border-b border-[var(--border-subtle)] text-[var(--text-primary)] font-bold uppercase text-[10px] tracking-wider">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-[var(--table-row-hover)] transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2 font-bold text-[var(--text-primary)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2 text-[var(--text-secondary)]">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
