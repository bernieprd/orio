import { useState, useRef, useCallback } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Overview from './views/Overview.jsx'
import TemplatesList from './views/TemplatesList.jsx'
import TemplateEditor from './views/TemplateEditor.jsx'
import OnboardingList from './views/OnboardingList.jsx'
import OnboardingFlow from './views/OnboardingFlow.jsx'
import DeptDefaults from './views/DeptDefaults.jsx'
import { templates as initialTemplates, activityFeed as initialActivity, departmentDefaults as initialDeptDefaults } from './data/mockData.js'

const SIDEBAR_ACTIVE = {
  overview:         null,
  templates:        'templates',
  'template-new':   'templates',
  'template-edit':  'templates',
  onboarding:       'onboarding',
  'onboarding-new': 'onboarding',
  'dept-defaults':  'templates',
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <div className="skeleton h-7 w-36" />
          <div className="skeleton h-4 w-56" />
        </div>
        <div className="skeleton h-10 w-36" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="skeleton h-44" />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [currentView, setCurrentView]   = useState('overview')
  const [viewParams, setViewParams]     = useState({})
  const [loading, setLoading]           = useState(false)
  const [viewKey, setViewKey]           = useState(0)
  const [templates, setTemplates]       = useState(initialTemplates)
  const [activityFeed, setActivityFeed] = useState(initialActivity)
  const [deptDefaults, setDeptDefaults] = useState(initialDeptDefaults)
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const navTimer                        = useRef(null)

  const navigate = useCallback((view, params = {}) => {
    if (navTimer.current) clearTimeout(navTimer.current)
    setSidebarOpen(false)
    setLoading(true)
    navTimer.current = setTimeout(() => {
      setCurrentView(view)
      setViewParams(params)
      setViewKey(k => k + 1)
      setLoading(false)
    }, 130)
  }, [])

  function saveTemplate(updatedTemplate) {
    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === updatedTemplate.id)
      const stamped = { ...updatedTemplate, needsAttention: false, editedAt: 'just now', editedAtMs: Date.now() }
      if (exists) return prev.map((t) => t.id === updatedTemplate.id ? stamped : t)
      return [...prev, stamped]
    })
  }

  function duplicateTemplate(id) {
    const original = templates.find(t => t.id === id)
    if (!original) return
    setTemplates(prev => [...prev, {
      ...original,
      id:             `tpl-${Date.now()}`,
      name:           `Copy of ${original.name}`,
      editedAt:       'just now',
      editedAtMs:     Date.now(),
      needsAttention: true,
    }])
  }

  function deleteTemplate(id) {
    setTemplates(prev => prev.filter(t => t.id !== id))
  }

  function addOnboarding(entry) {
    setActivityFeed(prev => [{
      id:              `act-${Date.now()}`,
      employee:        entry.employee,
      initials:        entry.initials,
      email:           entry.email,
      role:            entry.role,
      department:      entry.department,
      startDate:       entry.startDate,
      template:        entry.template,
      apps:            entry.apps,
      appBreakdown:    entry.appBreakdown,
      status:          entry.status,
      time:            'just now',
      dateProvisioned: entry.dateProvisioned,
      provisionedBy:   entry.provisionedBy,
      duration:        entry.duration,
    }, ...prev])
  }

  const sidebarActive = SIDEBAR_ACTIVE[currentView] ?? currentView

  function renderView() {
    switch (currentView) {
      case 'overview':
        return <Overview navigate={navigate} />
      case 'templates':
        return <TemplatesList navigate={navigate} templates={templates} toast={viewParams.toast} onDuplicate={duplicateTemplate} onDelete={deleteTemplate} />
      case 'template-new':
        return <TemplateEditor navigate={navigate} templateId={null} templates={templates} onSave={saveTemplate} deptDefaults={deptDefaults} />
      case 'template-edit':
        return <TemplateEditor navigate={navigate} templateId={viewParams.id} templates={templates} onSave={saveTemplate} deptDefaults={deptDefaults} />
      case 'onboarding':
        return <OnboardingList navigate={navigate} activityFeed={activityFeed} toast={viewParams.toast} />
      case 'onboarding-new':
        return <OnboardingFlow navigate={navigate} templates={templates} onSaveOnboarding={addOnboarding} />
      case 'dept-defaults':
        return <DeptDefaults navigate={navigate} deptDefaults={deptDefaults} onSave={(dept, apps) => setDeptDefaults(prev => ({ ...prev, [dept]: apps }))} />
      default:
        return <TemplatesList navigate={navigate} templates={templates} />
    }
  }

  return (
    <div className="min-h-screen bg-warm-50">
      <Sidebar
        currentView={sidebarActive}
        onNavigate={(view) => navigate(view)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <TopBar
        currentView={currentView}
        viewParams={viewParams}
        onHamburger={() => setSidebarOpen(o => !o)}
      />

      <main className="ml-0 md:ml-[60px] lg:ml-[220px] pt-14">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {loading ? (
            <div style={{ animation: 'fadeInUp 0.15s ease-out backwards' }}>
              <Skeleton />
            </div>
          ) : (
            <div key={viewKey} className="view-enter">
              {renderView()}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
