import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import TemplatesList from './views/TemplatesList.jsx'
import TemplateEditor from './views/TemplateEditor.jsx'
import OnboardingList from './views/OnboardingList.jsx'
import OnboardingFlow from './views/OnboardingFlow.jsx'
import ActivityDashboard from './views/ActivityDashboard.jsx'
import { templates as initialTemplates, onboardingHistory as initialOnboarding } from './data/mockData.js'

const SIDEBAR_ACTIVE = {
  templates:        'templates',
  'template-new':   'templates',
  'template-edit':  'templates',
  onboarding:       'onboarding',
  'onboarding-new': 'onboarding',
  activity:         'activity',
}

export default function App() {
  const [currentView, setCurrentView] = useState('templates')
  const [viewParams, setViewParams]   = useState({})
  const [templates, setTemplates]         = useState(initialTemplates)
  const [onboardingHistory, setOnboarding] = useState(initialOnboarding)

  function navigate(view, params = {}) {
    setCurrentView(view)
    setViewParams(params)
  }

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
    const tpl = templates.find(t => t.id === id)
    if (!tpl) return
    setTemplates(prev => prev.filter(t => t.id !== id))
    setOnboarding(prev => prev.map(entry =>
      entry.template === tpl.name ? { ...entry, templateDeleted: true } : entry
    ))
  }

  function addOnboarding(entry) {
    setOnboarding(prev => [entry, ...prev])
  }

  const sidebarActive = SIDEBAR_ACTIVE[currentView] ?? currentView

  function renderView() {
    switch (currentView) {
      case 'templates':
        return <TemplatesList navigate={navigate} templates={templates} toast={viewParams.toast} onDuplicate={duplicateTemplate} onDelete={deleteTemplate} />
      case 'template-new':
        return <TemplateEditor navigate={navigate} templateId={null} templates={templates} onSave={saveTemplate} />
      case 'template-edit':
        return <TemplateEditor navigate={navigate} templateId={viewParams.id} templates={templates} onSave={saveTemplate} />
      case 'onboarding':
        return <OnboardingList navigate={navigate} onboardingHistory={onboardingHistory} />
      case 'onboarding-new':
        return <OnboardingFlow navigate={navigate} templates={templates} onSaveOnboarding={addOnboarding} />
      case 'activity':
        return <ActivityDashboard navigate={navigate} />
      default:
        return <TemplatesList navigate={navigate} templates={templates} />
    }
  }

  return (
    <div className="min-h-screen bg-warm-50">
      <Sidebar
        currentView={sidebarActive}
        onNavigate={(view) => navigate(view)}
      />
      <TopBar currentView={currentView} viewParams={viewParams} />

      <main className="ml-[220px] pt-14">
        <div className="max-w-[1100px] mx-auto px-8 py-8">
          {renderView()}
        </div>
      </main>
    </div>
  )
}
