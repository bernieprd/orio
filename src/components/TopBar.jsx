import { Bell, ChevronRight, Menu, Zap } from 'lucide-react'

function getBreadcrumbs(currentView, viewParams) {
  switch (currentView) {
    case 'overview':       return ['Overview']
    case 'templates':      return ['Automation', 'Templates']
    case 'template-new':   return ['Automation', 'Templates', 'New template']
    case 'template-edit':  return ['Automation', 'Templates', viewParams?.name ?? 'Edit']
    case 'onboarding':     return ['Automation', 'Onboarding']
    case 'onboarding-new': return ['Automation', 'Onboarding', 'New']
    case 'dept-defaults':  return ['Automation', 'Templates', 'Dept. defaults']
    default:               return ['Automation']
  }
}

export default function TopBar({ currentView, viewParams, onHamburger }) {
  const crumbs = getBreadcrumbs(currentView, viewParams)
  const lastCrumb = crumbs[crumbs.length - 1]

  return (
    <header className="fixed top-0 left-0 md:left-[60px] lg:left-[220px] right-0 h-14 bg-white border-b border-warm-200 flex items-center justify-between px-4 sm:px-6 z-10">

      {/* Left: hamburger (mobile + tablet) + breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onHamburger}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-warm-500 hover:bg-warm-100 transition-colors flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>

        {/* Mobile: centered wordmark */}
        <div className="flex md:hidden absolute left-1/2 -translate-x-1/2 items-center gap-1.5 pointer-events-none">
          <div className="w-5 h-5 rounded bg-coral-400 flex items-center justify-center">
            <Zap size={11} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-base tracking-tight text-warm-900">orio</span>
        </div>

        {/* Tablet: current view name only */}
        <nav className="hidden md:flex lg:hidden items-center text-sm">
          <span className="text-warm-900 font-semibold">{lastCrumb}</span>
        </nav>

        {/* Desktop: full breadcrumb trail */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm">
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
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="relative p-1.5 rounded-lg text-warm-500 hover:bg-warm-100 transition-colors duration-150">
          <Bell size={18} strokeWidth={1.75} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-coral-400 border-2 border-white" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-coral-500">AM</span>
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-sm font-semibold text-warm-900">Alex M.</div>
            <div className="text-xs text-warm-400">IT Admin</div>
          </div>
        </div>
      </div>
    </header>
  )
}
