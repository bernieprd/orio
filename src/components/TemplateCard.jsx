import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Clock, Layers, Pencil, Copy, Trash2 } from 'lucide-react'
import { departmentColors } from '../data/mockData.js'
import AppIcon from './AppIcon.jsx'

const MAX_VISIBLE_ICONS = 5

function ThreeDotMenu({ onEdit, onDuplicate, onDelete }) {
  const [open,    setOpen]    = useState(false)
  const [confirm, setConfirm] = useState(false)
  const ref                   = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setConfirm(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function close() { setOpen(false); setConfirm(false) }

  return (
    <div ref={ref} className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => { setOpen(o => !o); setConfirm(false) }}
        className="p-1 rounded-md text-warm-400 hover:text-warm-700 hover:bg-warm-100 transition-colors duration-150 opacity-0 group-hover:opacity-100"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-7 w-44 bg-white rounded-lg shadow-warm-lg border border-warm-200 py-1 z-30">
          {!confirm ? (
            <>
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-warm-700 hover:bg-warm-50 transition-colors duration-100"
                onClick={() => { close(); onEdit?.() }}
              >
                <Pencil size={13} className="text-warm-400" /> Edit
              </button>
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-warm-700 hover:bg-warm-50 transition-colors duration-100"
                onClick={() => { close(); onDuplicate?.() }}
              >
                <Copy size={13} className="text-warm-400" /> Duplicate
              </button>
              <div className="my-1 border-t border-warm-100" />
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors duration-100"
                onClick={() => setConfirm(true)}
              >
                <Trash2 size={13} /> Delete
              </button>
            </>
          ) : (
            <div className="px-3 py-2">
              <p className="text-xs text-warm-700 font-medium mb-2">Delete this template?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { close(); onDelete?.() }}
                  className="flex-1 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirm(false)}
                  className="flex-1 py-1.5 rounded-md bg-warm-100 hover:bg-warm-200 text-warm-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function TemplateCard({ template, onClick, onDuplicate, onDelete }) {
  const deptColors   = departmentColors[template.department] ?? { bg: 'bg-warm-100', text: 'text-warm-600' }
  const visibleApps  = template.apps.slice(0, MAX_VISIBLE_ICONS)
  const overflow     = template.apps.length - MAX_VISIBLE_ICONS
  const needsAttention = template.needsAttention

  return (
    <div
      onClick={onClick}
      className={`
        group relative bg-white rounded-lg border p-5 cursor-pointer
        hover:-translate-y-0.5 hover:shadow-warm-md
        transition-all duration-200
        border-warm-200 hover:border-warm-300
      `}
    >
      {/* Header: name + three-dot */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-bold text-warm-900 text-base leading-snug">{template.name}</h3>
        <ThreeDotMenu
          onEdit={onClick}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      </div>

      {/* Department tag + app count */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${deptColors.bg} ${deptColors.text}`}>
          {template.department || '—'}
        </span>
        <span className="flex items-center gap-1 text-xs text-warm-400">
          <Layers size={12} />
          {template.apps.length} apps
        </span>
      </div>

      {/* App icon row */}
      <div className="flex items-center gap-1.5 mb-4">
        {visibleApps.map(app => <AppIcon key={app.name} name={app.name} icon={app.icon} size={24} />)}
        {overflow > 0 && (
          <div className="w-6 h-6 rounded-md bg-warm-100 flex items-center justify-center text-[10px] font-bold text-warm-500 flex-shrink-0">
            +{overflow}
          </div>
        )}
      </div>

      {/* Footer */}
      {needsAttention ? (
        <div>
          <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
            Review and save
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-warm-400">
          <Clock size={12} />
          <span>Edited {template.editedAt}</span>
        </div>
      )}
    </div>
  )
}
