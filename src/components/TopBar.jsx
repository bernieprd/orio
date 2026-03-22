import { Bell, ChevronRight } from 'lucide-react'

function getBreadcrumbs(currentView, viewParams) {
  switch (currentView) {
    case 'templates':      return ['Automation', 'Templates']
    case 'template-new':   return ['Automation', 'Templates', 'New Template']
    case 'template-edit':  return ['Automation', 'Templates', viewParams?.name ?? 'Edit']
    case 'onboarding':      return ['Automation', 'Onboarding']
    case 'onboarding-new':  return ['Automation', 'Onboarding', 'New']
    case 'activity':       return ['Automation', 'Activity']
    default:               return ['Automation']
  }
}

export default function TopBar({ currentView, viewParams }) {
  const crumbs = getBreadcrumbs(currentView, viewParams)

  return (
    <header className="fixed top-0 left-[220px] right-0 h-14 bg-white border-b border-warm-200 flex items-center justify-between px-6 z-10">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <span key={crumb} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={14} className="text-warm-300" />}
              <span className={isLast ? 'text-warm-900 font-semibold' : 'text-warm-400 font-medium'}>
                {crumb}
              </span>
            </span>
          )
        })}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative p-1.5 rounded-lg text-warm-500 hover:bg-warm-100 transition-colors duration-150">
          <Bell size={18} strokeWidth={1.75} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-coral-400 border-2 border-white" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center">
            <span className="text-xs font-bold text-coral-500">AM</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-warm-900">Alex M.</div>
            <div className="text-xs text-warm-400">IT Admin</div>
          </div>
        </div>
      </div>
    </header>
  )
}
