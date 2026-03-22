import {
  LayoutDashboard,
  Users,
  AppWindow,
  CreditCard,
  Settings,
  LayoutTemplate,
  UserPlus,
  Activity,
  Zap,
} from 'lucide-react'

const NAV_MAIN = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Users,           label: 'Employees' },
  { icon: AppWindow,       label: 'Applications' },
  { icon: CreditCard,      label: 'Billing' },
]

const NAV_AUTOMATION = [
  { icon: LayoutTemplate, label: 'Templates',  view: 'templates'  },
  { icon: UserPlus,       label: 'Onboarding', view: 'onboarding' },
  { icon: Activity,       label: 'Activity',   view: 'activity'   },
]

const NAV_BOTTOM = [
  { icon: Settings, label: 'Settings' },
]

export default function Sidebar({ currentView, onNavigate }) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-white border-r border-warm-200 flex flex-col z-20">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-warm-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-coral-400 flex items-center justify-center">
            <Zap size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-warm-900">orio</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
        {NAV_MAIN.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-3 py-2 rounded text-warm-400 cursor-not-allowed select-none"
          >
            <Icon size={18} strokeWidth={1.75} />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}

        {/* AUTOMATION section */}
        <div className="mt-5 mb-1.5 px-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-warm-400 uppercase">
              Automation
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-coral-100 text-coral-500 leading-none">
              NEW
            </span>
          </div>
        </div>

        {/* Subtle accent line left of automation section */}
        <div className="relative ml-3 pl-3 border-l-2 border-coral-200 flex flex-col gap-0.5">
          {NAV_AUTOMATION.map(({ icon: Icon, label, view }) => {
            const isActive = currentView === view
            return (
              <button
                key={view}
                onClick={() => onNavigate(view)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded w-full text-left
                  transition-all duration-150
                  ${isActive
                    ? 'bg-coral-50 text-coral-500 font-semibold'
                    : 'text-warm-700 hover:bg-warm-100 font-medium'}
                `}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.25 : 1.75}
                  className={isActive ? 'text-coral-400' : 'text-warm-500'}
                />
                <span className="text-sm">{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-coral-400" />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-3 border-t border-warm-100">
        {NAV_BOTTOM.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-3 py-2 rounded text-warm-400 cursor-not-allowed select-none"
          >
            <Icon size={18} strokeWidth={1.75} />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
