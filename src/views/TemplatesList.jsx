import { useState, useCallback, useRef, useEffect } from 'react'
import { Plus, LayoutTemplate, ChevronDown, LayoutGrid, SlidersHorizontal } from 'lucide-react'
import TemplateCard from '../components/TemplateCard.jsx'
import Toast from '../components/Toast.jsx'
import { departmentColors } from '../data/mockData.js'

const SORT_OPTIONS = [
  { value: 'edited', label: 'Last edited' },
  { value: 'alpha',  label: 'A → Z'       },
]

function sortTemplates(list, sort) {
  const copy = [...list]
  if (sort === 'alpha')  return copy.sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'access') return copy.sort((a, b) => (b.accessCount ?? 0) - (a.accessCount ?? 0))
  return copy.sort((a, b) => (b.editedAtMs ?? 0) - (a.editedAtMs ?? 0))
}

function groupByDept(list) {
  const groups = {}
  list.forEach(tpl => {
    const d = tpl.department || 'Other'
    if (!groups[d]) groups[d] = []
    groups[d].push(tpl)
  })
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
}

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const label = SORT_OPTIONS.find(o => o.value === value)?.label ?? 'Sort'

  useEffect(() => {
    function handleOutside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-warm-200 bg-white text-sm font-medium text-warm-700 hover:border-warm-300 hover:bg-warm-50 transition-colors duration-150"
      >
        {label}
        <ChevronDown size={13} className={`text-warm-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 w-44 bg-white rounded-lg shadow-warm-lg border border-warm-200 py-1 z-20">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors duration-100
                ${value === opt.value
                  ? 'text-coral-500 font-semibold bg-coral-50'
                  : 'text-warm-700 hover:bg-warm-50'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ onNew }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-coral-50 border-2 border-coral-100 flex items-center justify-center mb-5">
        <LayoutTemplate size={28} className="text-coral-400" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-bold text-warm-900 mb-2">No templates yet</h2>
      <p className="text-sm text-warm-500 max-w-xs mb-6 leading-relaxed">
        Create your first access template to speed up onboarding.
      </p>
      <button
        onClick={onNew}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-coral-400 hover:bg-coral-500 text-white text-sm font-semibold transition-colors duration-150 shadow-warm"
      >
        <Plus size={16} strokeWidth={2.5} />
        New Template
      </button>
    </div>
  )
}

function DeptSection({ dept, templates, onEdit, onDuplicate, onDelete }) {
  const colors = departmentColors[dept] ?? { bg: 'bg-warm-100', text: 'text-warm-600' }
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
          {dept}
        </span>
        <span className="text-xs text-warm-400">{templates.length} template{templates.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(tpl => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            onClick={() => onEdit(tpl.id)}
            onDuplicate={() => onDuplicate?.(tpl.id)}
            onDelete={() => onDelete?.(tpl.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default function TemplatesList({ navigate, templates, toast: initialToast, onDuplicate, onDelete, deptDefaults }) {
  const [toast,   setToast]   = useState(initialToast ?? null)
  const [sort,    setSort]    = useState('edited')
  const [grouped, setGrouped] = useState(false)
  const dismissToast = useCallback(() => setToast(null), [])

  function openEditor(id) {
    const tpl = templates.find(t => t.id === id)
    navigate('template-edit', { id, name: tpl?.name })
  }

  function openNew() { navigate('template-new') }

  const sorted = sortTemplates(templates, sort)

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-wrap items-start gap-4 justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-warm-900">Templates</h1>
          <p className="text-sm text-warm-400 mt-0.5">
            Define the app access packages for each role.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-coral-400 hover:bg-coral-500 active:bg-coral-600 text-white text-sm font-semibold transition-colors duration-150 shadow-warm"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Template
        </button>
      </div>

      {/* Content */}
      {templates.length === 0 ? (
        <EmptyState onNew={openNew} />
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setGrouped(g => !g)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors duration-150
                ${grouped
                  ? 'border-coral-300 bg-coral-50 text-coral-500 hover:bg-coral-100'
                  : 'border-warm-200 bg-white text-warm-700 hover:border-warm-300 hover:bg-warm-50'
                }`}
            >
              <LayoutGrid size={13} />
              Group by dept
            </button>
            <SortDropdown value={sort} onChange={setSort} />
            <button
              onClick={() => navigate('dept-defaults')}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100 text-sm font-medium transition-colors duration-150"
            >
              <SlidersHorizontal size={13} />
              Dept. Defaults
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-500 leading-none">Beta</span>
            </button>
          </div>

          {/* Grid or grouped sections */}
          {grouped ? (
            <div className="flex flex-col gap-8">
              {groupByDept(sorted).map(([dept, tpls]) => (
                <DeptSection
                  key={dept}
                  dept={dept}
                  templates={tpls}
                  onEdit={openEditor}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sorted.map(tpl => (
                <TemplateCard
                  key={tpl.id}
                  template={tpl}
                  onClick={() => openEditor(tpl.id)}
                  onDuplicate={() => onDuplicate?.(tpl.id)}
                  onDelete={() => onDelete?.(tpl.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  )
}
