import { useState, useCallback } from 'react'
import { ArrowLeft, Plus, X, Layers, LayoutTemplate, Info, ChevronDown } from 'lucide-react'
import AppSearchModal from '../components/AppSearchModal.jsx'
import Toast from '../components/Toast.jsx'
import { departmentColors, appsCatalog } from '../data/mockData.js'
import AppIcon from '../components/AppIcon.jsx'

const DEPARTMENTS = [
  'Product', 'Engineering', 'Sales', 'Marketing',
  'HR', 'Finance', 'Operations', 'Support',
]

// ─── Live Preview card (right column) ────────────────────────────────────────

function LivePreview({ form }) {
  const deptColors = departmentColors[form.department] ?? null
  const MAX_ICONS = 5
  const visibleApps = form.apps.slice(0, MAX_ICONS)
  const overflow    = form.apps.length - MAX_ICONS
  const [descExpanded, setDescExpanded] = useState(false)

  return (
    <div className="lg:sticky lg:top-8">
      <div className="bg-white rounded-lg border border-warm-200 shadow-warm overflow-hidden">

        {/* Header */}
        <div className="px-5 py-3 border-b border-warm-100 bg-warm-50">
          <p className="text-xs font-bold text-warm-400 uppercase tracking-widest">Live Preview</p>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Name */}
          <h3 className={`font-bold text-base mb-1 ${form.name ? 'text-warm-900' : 'text-warm-300'}`}>
            {form.name || 'Template name'}
          </h3>

          {/* Description */}
          {form.description && (
            <div className="mb-3">
              <p className={`text-xs text-warm-500 ${descExpanded ? '' : 'truncate'}`}>
                {form.description}
              </p>
              {form.description.length > 48 && (
                <button
                  onClick={() => setDescExpanded((v) => !v)}
                  className="text-[11px] text-coral-400 hover:text-coral-500 font-semibold mt-0.5 transition-colors"
                >
                  {descExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          )}

          {/* Dept + count */}
          <div className="flex items-center gap-2 mb-4">
            {form.department && deptColors ? (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${deptColors.bg} ${deptColors.text}`}>
                {form.department}
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-warm-100 text-warm-400">
                No department
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-warm-400">
              <Layers size={12} />
              {form.apps.length} app{form.apps.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* App icons row */}
          {form.apps.length > 0 ? (
            <div className="flex items-center gap-1.5 mb-4">
              {visibleApps.map((app) => (
                <AppIcon key={app.name} name={app.name} icon={app.icon} size={24} />
              ))}
              {overflow > 0 && (
                <div className="w-6 h-6 rounded-md bg-warm-100 flex items-center justify-center text-[10px] font-bold text-warm-500 flex-shrink-0">
                  +{overflow}
                </div>
              )}
            </div>
          ) : (
            <div className="h-6 flex items-center mb-4">
              <span className="text-xs text-warm-300 italic">No apps added yet</span>
            </div>
          )}

          {/* App name list */}
          {form.apps.length > 0 && (
            <div className="border-t border-warm-100 pt-3 space-y-2">
              {form.apps.map((app) => (
                <div key={app.name} className="flex items-center gap-2">
                  <AppIcon name={app.name} icon={app.icon} size={20} />
                  <span className="text-xs text-warm-700">{app.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="flex items-start gap-2 px-5 pb-4">
          <Info size={13} className="text-warm-300 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-warm-400 leading-relaxed">
            This is what IT admins will see when selecting this template during onboarding.
          </p>
        </div>

      </div>
    </div>
  )
}

// ─── Main editor ─────────────────────────────────────────────────────────────

export default function TemplateEditor({ navigate, templateId, templates, onSave, deptDefaults = {} }) {
  const existing = templateId ? templates.find((t) => t.id === templateId) : null

  const [form, setForm] = useState({
    name:        existing?.name        ?? '',
    department:  existing?.department  ?? '',
    description: existing?.description ?? '',
    apps:        existing?.apps        ?? [],
  })

  const [showModal, setShowModal] = useState(false)
  const [defaultsBanner, setDefaultsBanner] = useState(null) // dept name or null
  const [showPreview, setShowPreview] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function selectDepartment(dept) {
    const next = form.department === dept ? '' : dept
    update('department', next)
    setDefaultsBanner(next && deptDefaults[next]?.length ? next : null)
  }

  function applyDefaults() {
    const names = deptDefaults[defaultsBanner] ?? []
    const toAdd = names
      .filter(name => !form.apps.some(a => a.name === name))
      .map(name => appsCatalog.find(a => a.name === name))
      .filter(Boolean)
    setForm(f => ({ ...f, apps: [...f.apps, ...toAdd] }))
    setDefaultsBanner(null)
  }

  function removeApp(appName) {
    setForm((f) => ({ ...f, apps: f.apps.filter((a) => a.name !== appName) }))
  }

  function toggleApp(app) {
    setForm((f) => {
      const exists = f.apps.some((a) => a.name === app.name)
      return {
        ...f,
        apps: exists
          ? f.apps.filter((a) => a.name !== app.name)
          : [...f.apps, app],
      }
    })
  }


  const canSave = form.name.trim() !== '' && form.department !== '' && form.apps.length > 0

  function handleSave() {
    if (!canSave) return
    const saved = {
      id:          templateId ?? `tpl-${Date.now()}`,
      name:        form.name.trim(),
      department:  form.department,
      description: form.description,
      apps:        form.apps,
      editedAt:    'just now',
    }
    onSave(saved)
    navigate('templates', { toast: 'Template saved successfully' })
  }

  const isNew = !templateId

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

      {/* Page title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-lg bg-coral-50 border border-coral-100 flex items-center justify-center">
          <LayoutTemplate size={18} className="text-coral-400" />
        </div>
        <h1 className="text-xl font-extrabold text-warm-900">
          {isNew ? 'New template' : `Edit: ${existing?.name}`}
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ── Left column (60%) ─────────────────────────────────── */}
        <div className="flex-[3] min-w-0 w-full">
          <div className="bg-white rounded-lg border border-warm-200 p-5">

            {/* Template Name */}
            <div>
              <label className="block text-xs font-bold text-warm-600 uppercase tracking-wider mb-2">
                Template name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="e.g., Product Designer"
                className="
                  w-full px-3 py-2.5 rounded-lg border border-warm-200
                  text-warm-900 text-sm font-medium placeholder:text-warm-300
                  bg-warm-50 focus:bg-white focus:border-coral-300 focus:outline-none
                  focus:ring-2 focus:ring-coral-100
                  transition-colors duration-150
                "
              />
            </div>

            {/* Department */}
            <div style={{ paddingTop: '1.25rem' }}>
              <label className="block text-xs font-bold text-warm-600 uppercase tracking-wider mb-2">
                Department
              </label>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map((dept) => {
                  const isSelected = form.department === dept
                  const colors     = departmentColors[dept]
                  return (
                    <button
                      key={dept}
                      onClick={() => selectDepartment(dept)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                        ${isSelected && colors
                          ? `${colors.bg} ${colors.text} border-transparent ring-2 ring-offset-1 ring-current ring-opacity-30`
                          : 'bg-warm-50 text-warm-600 border-warm-200 hover:border-warm-300 hover:bg-warm-100'
                        }
                      `}
                    >
                      {dept}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Department defaults banner */}
            {defaultsBanner && (
              <div className="mt-3 px-3.5 py-2.5 rounded-lg bg-violet-50 border border-violet-100">
                <div className="flex items-start gap-2 mb-2.5">
                  <span className="text-base leading-none mt-px">✨</span>
                  <span className="text-xs text-violet-700">
                    <span className="font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-600 mr-1.5 text-[10px] uppercase tracking-wide">Beta</span>
                    Pre-fill with <span className="font-semibold">{defaultsBanner}</span> defaults?
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <button
                    onClick={applyDefaults}
                    className="px-2.5 py-1 rounded-md bg-violet-100 hover:bg-violet-200 text-violet-700 text-xs font-semibold transition-colors duration-150"
                  >
                    Apply defaults
                  </button>
                  <button
                    onClick={() => setDefaultsBanner(null)}
                    className="text-xs text-violet-400 hover:text-violet-600 transition-colors duration-150"
                  >
                    No thanks
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <div style={{ paddingTop: '1.25rem' }}>
              <label className="block text-xs font-bold text-warm-600 uppercase tracking-wider mb-2">
                Description
                <span className="ml-1.5 font-normal text-warm-400 normal-case tracking-normal">optional</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Describe when this template should be used..."
                rows={3}
                className="
                  w-full px-3 py-2.5 rounded-lg border border-warm-200
                  text-warm-900 text-sm placeholder:text-warm-300 resize-none
                  bg-warm-50 focus:bg-white focus:border-coral-300 focus:outline-none
                  focus:ring-2 focus:ring-coral-100
                  transition-colors duration-150
                "
              />
            </div>

            {/* Applications */}
            <div style={{ paddingTop: '1.25rem' }}>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-warm-600 uppercase tracking-wider flex items-center gap-2">
                  Applications
                  <span className="bg-warm-100 text-warm-600 text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                    {form.apps.length}
                  </span>
                </label>
                <button
                  onClick={() => setShowModal(true)}
                  className="
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    bg-coral-50 hover:bg-coral-100 text-coral-500 hover:text-coral-600
                    text-xs font-semibold border border-coral-100 hover:border-coral-200
                    transition-all duration-150
                  "
                >
                  <Plus size={13} strokeWidth={2.5} />
                  Add app
                </button>
              </div>

              {form.apps.length === 0 ? (
                <div
                  onClick={() => setShowModal(true)}
                  className="
                    flex flex-col items-center justify-center py-8
                    border-2 border-dashed border-warm-200 rounded-lg
                    text-warm-400 text-sm cursor-pointer
                    hover:border-coral-200 hover:text-coral-400
                    transition-colors duration-150
                  "
                >
                  <Plus size={20} className="mb-2 opacity-60" />
                  <span>Add apps to this template</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {form.apps.map((app) => (
                    <div
                      key={app.name}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-warm-50 border border-warm-100 group"
                    >
                      <AppIcon name={app.name} icon={app.icon} size={32} />
                      <span className="flex-1 text-sm font-medium text-warm-800">{app.name}</span>
                      <span
                        title="Access levels coming soon — Admin, Member, Viewer"
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-warm-100 text-warm-400 cursor-not-allowed select-none opacity-70"
                      >
                        Member
                      </span>
                      <button
                        onClick={() => removeApp(app.name)}
                        className="
                          opacity-0 group-hover:opacity-100
                          p-1 rounded text-warm-400 hover:text-red-400 hover:bg-red-50
                          transition-all duration-150
                        "
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="
                px-5 py-2.5 rounded-lg text-sm font-semibold shadow-warm
                transition-colors duration-150
                disabled:bg-warm-200 disabled:text-warm-400 disabled:cursor-not-allowed disabled:shadow-none
                bg-coral-400 hover:bg-coral-500 active:bg-coral-600 text-white
              "
            >
              Save template
            </button>
            <button
              onClick={() => navigate('templates')}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-warm-500 hover:text-warm-800 hover:bg-warm-100 transition-colors duration-150"
            >
              Cancel
            </button>
            {!canSave && (
              <span className="text-xs text-warm-400">
                {!form.name.trim()
                  ? 'Add a template name to continue'
                  : !form.department
                  ? 'Select a department to continue'
                  : 'Add at least one app to continue'}
              </span>
            )}
          </div>
        </div>

        {/* ── Right column (40%) ────────────────────────────────── */}
        <div className="flex-[2] min-w-0 w-full">
          {/* Toggle button — only visible below lg */}
          <button
            onClick={() => setShowPreview(v => !v)}
            className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white border border-warm-200 rounded-lg text-sm font-semibold text-warm-700 hover:bg-warm-50 transition-colors mb-2"
          >
            Live preview
            <ChevronDown size={15} className={`text-warm-400 transition-transform duration-150 ${showPreview ? 'rotate-180' : ''}`} />
          </button>
          <div className={`lg:block ${showPreview ? 'block' : 'hidden'}`}>
            <LivePreview form={form} />
          </div>
        </div>
      </div>

      {/* App search modal */}
      {showModal && (
        <AppSearchModal
          addedApps={form.apps}
          onToggle={toggleApp}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  )
}
