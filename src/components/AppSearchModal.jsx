import { useEffect, useRef, useState } from 'react'
import { Search, Check, X } from 'lucide-react'
import { appsCatalog, appColors } from '../data/mockData.js'

function AppIcon({ app, size = 32 }) {
  const color = appColors[app.icon] ?? '#8F8B82'
  return (
    <div
      title={app.name}
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.38 }}
      className="rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold shadow-sm"
    >
      {app.name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function AppSearchModal({ addedApps, onToggle, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const addedNames = new Set(addedApps.map((a) => a.name))

  const filtered = appsCatalog.filter((app) =>
    app.name.toLowerCase().includes(query.toLowerCase()) ||
    app.category.toLowerCase().includes(query.toLowerCase())
  )

  // Sort: not-added first
  const sorted = [...filtered].sort((a, b) => {
    const aAdded = addedNames.has(a.name) ? 1 : 0
    const bAdded = addedNames.has(b.name) ? 1 : 0
    return aAdded - bAdded
  })

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-40 bg-black/20 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white rounded-xl shadow-warm-lg border border-warm-200 w-[420px] max-h-[520px] flex flex-col animate-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalIn 0.18s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-warm-100">
          <h3 className="font-bold text-warm-900 text-sm">Add Application</h3>
          <button onClick={onClose} className="text-warm-400 hover:text-warm-700 transition-colors p-0.5">
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-warm-100">
          <div className="flex items-center gap-2 bg-warm-50 border border-warm-200 rounded-lg px-3 py-2">
            <Search size={15} className="text-warm-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps or categories..."
              className="flex-1 bg-transparent text-sm text-warm-900 placeholder:text-warm-400 outline-none"
            />
          </div>
        </div>

        {/* App list */}
        <div className="overflow-y-auto flex-1">
          {sorted.length === 0 ? (
            <div className="py-10 text-center text-sm text-warm-400">No apps match "{query}"</div>
          ) : (
            sorted.map((app) => {
              const isAdded = addedNames.has(app.name)
              return (
                <button
                  key={app.name}
                  onClick={() => onToggle(app)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left
                    transition-colors duration-100
                    ${isAdded
                      ? 'opacity-60 hover:bg-warm-50'
                      : 'hover:bg-warm-50'
                    }
                  `}
                >
                  <AppIcon app={app} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-warm-900">{app.name}</div>
                    <div className="text-xs text-warm-400">{app.category}</div>
                  </div>
                  {isAdded && (
                    <Check size={16} className="text-emerald-500 flex-shrink-0" />
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-warm-100 flex items-center justify-between">
          <span className="text-xs text-warm-400">
            {addedNames.size} app{addedNames.size !== 1 ? 's' : ''} added
          </span>
          <button
            onClick={onClose}
            className="text-sm font-semibold text-coral-500 hover:text-coral-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(-4px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
      `}</style>
    </div>
  )
}
