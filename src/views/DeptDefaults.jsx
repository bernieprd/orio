import { useState } from 'react'
import { Plus, X, ChevronDown, ChevronRight, SlidersHorizontal, ArrowLeft } from 'lucide-react'
import AppSearchModal from '../components/AppSearchModal.jsx'
import Toast from '../components/Toast.jsx'
import { departmentColors, appsCatalog } from '../data/mockData.js'
import AppIcon from '../components/AppIcon.jsx'

const DEPARTMENTS = [
  'Product', 'Engineering', 'Sales', 'HR',
  'Marketing', 'Finance', 'Operations', 'Support',
]

export default function DeptDefaults({ deptDefaults, onSave, navigate }) {
  const [expanded, setExpanded]     = useState(null)
  const [modalFor, setModalFor]     = useState(null) // dept name when modal open
  const [toast, setToast]           = useState(null)

  // Local copy for editing — keyed by dept name, values are app name arrays
  const [local, setLocal] = useState(() => ({ ...deptDefaults }))

  function toggleExpand(dept) {
    setExpanded(prev => prev === dept ? null : dept)
  }

  function removeApp(dept, appName) {
    const next = (local[dept] ?? []).filter(n => n !== appName)
    setLocal(prev => ({ ...prev, [dept]: next }))
    onSave(dept, next)
    setToast(`${dept} defaults updated`)
  }

  function addApp(dept, app) {
    const current = local[dept] ?? []
    if (current.includes(app.name)) return
    const next = [...current, app.name]
    setLocal(prev => ({ ...prev, [dept]: next }))
    onSave(dept, next)
    setToast(`${dept} defaults updated`)
  }

  // AppSearchModal works with app objects; build current list as objects for the modal
  function appsAsObjects(dept) {
    return (local[dept] ?? [])
      .map(name => appsCatalog.find(a => a.name === name))
      .filter(Boolean)
  }

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => navigate('templates')}
        className="flex items-center gap-1.5 text-sm text-warm-500 hover:text-warm-800 mb-6 transition-colors duration-150"
      >
        <ArrowLeft size={15} />
        Back to templates
      </button>

      {/* Beta banner */}
      <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-lg bg-violet-50 border border-violet-100 text-sm text-violet-700">
        <span className="text-base leading-none">🧪</span>
        <span>
          <span className="font-semibold">Beta:</span> Department defaults are a new feature. They pre-fill apps when creating templates — admins always have final control.
        </span>
      </div>

      {/* Page header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
          <SlidersHorizontal size={18} className="text-violet-400" />
        </div>
        <h1 className="text-xl font-extrabold text-warm-900">Department defaults</h1>
      </div>
      <p className="text-sm text-warm-500 mb-6 ml-12">
        Configure which apps are pre-filled when creating a template for each department. These are starting points — admins can always customize per template.
      </p>

      {/* Department list */}
      <div className="flex flex-col gap-2">
        {DEPARTMENTS.map(dept => {
          const isOpen    = expanded === dept
          const deptColors = departmentColors[dept] ?? { bg: 'bg-warm-100', text: 'text-warm-600' }
          const appNames  = local[dept] ?? []

          return (
            <div
              key={dept}
              className="bg-white rounded-lg border border-warm-200 overflow-hidden"
            >
              {/* Row header */}
              <button
                onClick={() => toggleExpand(dept)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-warm-50 transition-colors duration-150 text-left"
              >
                {isOpen
                  ? <ChevronDown size={16} className="text-warm-400 flex-shrink-0" />
                  : <ChevronRight size={16} className="text-warm-400 flex-shrink-0" />
                }
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${deptColors.bg} ${deptColors.text}`}>
                  {dept}
                </span>
                <span className="flex-1" />
                <span className="text-xs text-warm-400">
                  {appNames.length} app{appNames.length !== 1 ? 's' : ''}
                </span>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-4 pb-4 border-t border-warm-100">
                  <div className="flex flex-col gap-1.5 mt-3">
                    {appNames.length === 0 ? (
                      <p className="text-xs text-warm-400 italic py-2">No default apps — click "+ Add App" to add some.</p>
                    ) : (
                      appNames.map(name => (
                        <div
                          key={name}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-warm-50 border border-warm-100 group"
                        >
                          <AppIcon name={name} size={28} />
                          <span className="flex-1 text-sm font-medium text-warm-800">{name}</span>
                          <span
                            title="Access levels coming soon — Admin, Member, Viewer"
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-warm-100 text-warm-400 cursor-not-allowed select-none opacity-70"
                          >
                            Member
                          </span>
                          <button
                            onClick={() => removeApp(dept, name)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded text-warm-400 hover:text-red-400 hover:bg-red-50 transition-all duration-150"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => setModalFor(dept)}
                    className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-coral-50 hover:bg-coral-100 text-coral-500 hover:text-coral-600 text-xs font-semibold border border-coral-100 hover:border-coral-200 transition-all duration-150"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                    Add app
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* App search modal */}
      {modalFor && (
        <AppSearchModal
          addedApps={appsAsObjects(modalFor)}
          onToggle={(app) => {
            const current = local[modalFor] ?? []
            if (current.includes(app.name)) {
              removeApp(modalFor, app.name)
            } else {
              addApp(modalFor, app)
            }
          }}
          onClose={() => setModalFor(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}
