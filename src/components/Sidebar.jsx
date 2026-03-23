import { useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  AppWindow,
  CreditCard,
  Settings,
  LayoutTemplate,
  UserPlus,
  UserMinus,
  Zap,
  X,
} from 'lucide-react'

const NAV_MAIN = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Users,           label: 'Employees' },
  { icon: AppWindow,       label: 'Applications' },
  { icon: CreditCard,      label: 'Billing' },
]

const NAV_AUTOMATION = [
  { icon: LayoutTemplate, label: 'Templates',   view: 'templates'  },
  { icon: UserPlus,       label: 'Onboarding',  view: 'onboarding' },
  { icon: UserMinus,      label: 'Offboarding', view: null         },
]

// ── Full sidebar content (shared by desktop + overlay) ─────────────────────

function SidebarContent({ currentView, onNavigate, showClose, onClose }) {
  return (
    <>
      <div className="px-5 py-5 border-b border-warm-100 flex items-center justify-between">
        <div
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-2.5 cursor-pointer opacity-100 hover:opacity-75 transition-opacity duration-150"
        >
          <div className="w-8 h-8 rounded-lg bg-coral-400 flex items-center justify-center">
            <Zap size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-warm-900">orio</span>
        </div>
        {showClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-warm-400 hover:text-warm-700 hover:bg-warm-100 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
        {NAV_MAIN.map(({ icon: Icon, label, view }) => {
          if (view) {
            const isActive = currentView === view
            return (
              <button
                key={label}
                onClick={() => onNavigate(view)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded w-full text-left transition-all duration-150
                  ${isActive ? 'bg-coral-50 text-coral-500 font-semibold' : 'text-warm-700 hover:bg-warm-100 font-medium'}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} className={isActive ? 'text-coral-400' : 'text-warm-500'} />
                <span className="text-sm">{label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-coral-400" />}
              </button>
            )
          }
          return (
            <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded text-warm-400 cursor-not-allowed select-none">
              <Icon size={18} strokeWidth={1.75} />
              <span className="text-sm font-medium">{label}</span>
            </div>
          )
        })}

        <div className="mt-5 mb-1.5 px-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-warm-400 uppercase">Automation</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-coral-100 text-coral-500 leading-none">NEW</span>
          </div>
        </div>

        <div className="relative ml-3 pl-3 border-l-2 border-coral-200 flex flex-col gap-0.5">
          {NAV_AUTOMATION.map(({ icon: Icon, label, view }) => {
            if (view === null) {
              return (
                <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded text-warm-300 cursor-not-allowed select-none">
                  <Icon size={18} strokeWidth={1.75} />
                  <span className="text-sm font-medium">{label}</span>
                  <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-warm-100 text-warm-400 leading-none">Soon</span>
                </div>
              )
            }
            const isActive = currentView === view
            return (
              <button
                key={view}
                onClick={() => onNavigate(view)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded w-full text-left transition-all duration-150
                  ${isActive ? 'bg-coral-50 text-coral-500 font-semibold' : 'text-warm-700 hover:bg-warm-100 font-medium'}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} className={isActive ? 'text-coral-400' : 'text-warm-500'} />
                <span className="text-sm">{label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-coral-400" />}
              </button>
            )
          })}
        </div>
      </nav>

      <div className="px-3 py-3 border-t border-warm-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded text-warm-400 cursor-not-allowed select-none">
          <Settings size={18} strokeWidth={1.75} />
          <span className="text-sm font-medium">Settings</span>
        </div>
      </div>
    </>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export default function Sidebar({ currentView, onNavigate, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return
    function handle(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [isOpen, onClose])

  const allNavItems = [...NAV_MAIN, ...NAV_AUTOMATION]

  return (
    <>
      {/* Backdrop for overlay on mobile + tablet */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} />
      )}

      {/* Desktop full sidebar (lg+) — always visible */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[220px] bg-white border-r border-warm-200 flex-col z-20">
        <SidebarContent currentView={currentView} onNavigate={onNavigate} />
      </aside>

      {/* Tablet icon rail (md → lg) */}
      <aside className="hidden md:flex lg:hidden fixed left-0 top-0 bottom-0 w-[60px] bg-white border-r border-warm-200 flex-col z-20">
        <div
          className="flex items-center justify-center py-5 border-b border-warm-100 cursor-pointer opacity-100 hover:opacity-75 transition-opacity duration-150"
          onClick={() => onNavigate('overview')}
        >
          <div className="w-8 h-8 rounded-lg bg-coral-400 flex items-center justify-center">
            <Zap size={16} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 flex flex-col gap-1 items-center">
          {allNavItems.map(({ icon: Icon, label, view }) => {
            const isActive = view && currentView === view
            const isDimmed = !view || view === null
            return (
              <div
                key={label}
                title={label}
                onClick={isDimmed ? undefined : () => onNavigate(view)}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150
                  ${isDimmed
                    ? 'text-warm-300 cursor-not-allowed'
                    : isActive
                    ? 'bg-coral-50 text-coral-400 cursor-pointer'
                    : 'text-warm-500 hover:bg-warm-100 cursor-pointer'}
                `}
              >
                <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} />
              </div>
            )
          })}
        </nav>

        <div className="py-3 border-t border-warm-100 flex items-center justify-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg text-warm-300 cursor-not-allowed" title="Settings">
            <Settings size={18} strokeWidth={1.75} />
          </div>
        </div>
      </aside>

      {/* Overlay sidebar (mobile + tablet, slides in when open) */}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 w-[280px] bg-white border-r border-warm-200 flex flex-col z-40 lg:hidden
          transform transition-transform duration-200 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarContent
          currentView={currentView}
          onNavigate={onNavigate}
          showClose
          onClose={onClose}
        />
      </aside>
    </>
  )
}
