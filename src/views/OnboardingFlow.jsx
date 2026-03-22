import { useState, useEffect, useRef } from 'react'
import {
  ArrowLeft, ArrowRight, Check, X, Loader2,
  CheckCircle2, Sparkles, RefreshCw,
  Mail, Briefcase, Calendar, AlertCircle,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import AppSearchModal from '../components/AppSearchModal.jsx'
import { departmentColors, appColors } from '../data/mockData.js'

const DEPARTMENTS = [
  'Product', 'Engineering', 'Sales', 'Marketing',
  'HR', 'Finance', 'Operations', 'Support',
]

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAYS_SHORT = ['Su','Mo','Tu','We','Th','Fr','Sa']

// ─── Shared helpers ───────────────────────────────────────────────────────────

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

function fullName(emp) {
  return [emp.firstName, emp.lastName].filter(Boolean).join(' ')
}

function initials(emp) {
  return ((emp.firstName?.[0] ?? '') + (emp.lastName?.[0] ?? '')).toUpperCase()
}

function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

// ─── Custom DatePicker ────────────────────────────────────────────────────────

function DatePicker({ value, onChange }) {
  const [open, setOpen]         = useState(false)
  const ref                     = useRef(null)
  const today                   = new Date()
  const parsed                  = value ? new Date(value + 'T12:00:00') : null
  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? today.getMonth())

  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const daysInMonth    = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOffset = new Date(viewYear, viewMonth, 1).getDay()
  const cells          = [...Array(firstDayOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  function selectDay(day) {
    const m = String(viewMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    onChange(`${viewYear}-${m}-${d}`)
    setOpen(false)
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function isSelected(day) {
    return parsed && parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === day
  }
  function isToday(day) {
    return today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full px-3 py-2.5 rounded-lg border text-left text-sm font-medium transition-colors duration-150 flex items-center justify-between
          ${open ? 'border-coral-300 bg-white ring-2 ring-coral-100' : 'border-warm-200 bg-warm-50 hover:bg-white hover:border-warm-300'}
          ${value ? 'text-warm-900' : 'text-warm-300'}
        `}
      >
        <span>{value ? formatDate(value) : 'Select a date'}</span>
        <Calendar size={15} className="text-warm-400 flex-shrink-0" />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1.5 z-30 bg-white border border-warm-200 rounded-lg shadow-warm-lg p-4 w-[272px]"
          style={{ animation: 'modalIn 0.15s ease-out' }}
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-warm-100 text-warm-500 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-warm-900">{MONTHS[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-warm-100 text-warm-500 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS_SHORT.map(d => (
              <span key={d} className="text-center text-[11px] font-bold text-warm-400 py-1">{d}</span>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => (
              <div key={i} className="flex items-center justify-center aspect-square">
                {day && (
                  <button
                    onClick={() => selectDay(day)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-100 flex items-center justify-center
                      ${isSelected(day)
                        ? 'bg-coral-400 text-white shadow-warm'
                        : isToday(day)
                        ? 'border border-coral-200 text-coral-500 hover:bg-coral-50'
                        : 'text-warm-700 hover:bg-warm-100'
                      }
                    `}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

const STEPS = ['Employee Details', 'Review Access', 'Provision']

function Stepper({ currentStep }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => {
        const num    = i + 1
        const done   = currentStep > num
        const active = currentStep === num
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300
                ${done ? 'bg-coral-400 text-white' : active ? 'bg-warm-900 text-white' : 'bg-warm-100 text-warm-400'}`}
              >
                {done ? <Check size={12} strokeWidth={3} /> : num}
              </div>
              <span className={`text-sm font-semibold whitespace-nowrap transition-colors duration-200
                ${done ? 'text-coral-400' : active ? 'text-warm-900' : 'text-warm-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-4 transition-colors duration-500 ${done ? 'bg-coral-200' : 'bg-warm-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Employee Details ─────────────────────────────────────────────────

function EmployeeStep({ templates, onNext }) {
  const [form, setForm]               = useState({
    firstName: '', lastName: '', email: '', department: '', role: '', startDate: '',
  })
  const [emailEdited, setEmailEdited] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  // Auto-generate email from name unless user has manually edited it
  useEffect(() => {
    if (emailEdited) return
    const first = form.firstName.trim().toLowerCase().replace(/\s+/g, '')
    const last  = form.lastName.trim().toLowerCase().replace(/\s+/g, '')
    const generated = [first, last].filter(Boolean).join('.') + (first || last ? '@company.com' : '')
    setForm(f => ({ ...f, email: generated }))
  }, [form.firstName, form.lastName, emailEdited])

  // Reset selected template when department changes
  useEffect(() => { setSelectedTemplate(null) }, [form.department])

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  function applyTemplate(tpl) {
    set('role', tpl.name)
    setSelectedTemplate(tpl)
  }

  const deptTemplates = form.department
    ? templates.filter(t => t.department === form.department)
    : []

  const resolvedTemplate = selectedTemplate ?? deptTemplates[0] ?? null

  const canContinue = form.firstName && form.lastName && form.email && form.department && form.role && form.startDate

  return (
    <div className="max-w-[560px]">
      <div className="bg-white rounded-lg border border-warm-200 p-6">

        {/* First + Last name */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <Field label="First Name">
            <input type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)}
              placeholder="Maria" className={inputCls} />
          </Field>
          <Field label="Last Name">
            <input type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)}
              placeholder="Santos" className={inputCls} />
          </Field>
        </div>

        {/* Email — auto-generated, manually editable */}
        <div className="mb-5">
          <Field label="Work Email">
            <input
              type="email"
              value={form.email}
              onChange={e => { setEmailEdited(true); set('email', e.target.value) }}
              placeholder="maria.santos@company.com"
              className={inputCls}
            />
          </Field>
        </div>

        {/* Department — pill tags */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-warm-600 uppercase tracking-wider mb-2">Department</label>
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map(dept => {
              const isSelected = form.department === dept
              const colors     = departmentColors[dept]
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => set('department', isSelected ? '' : dept)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                    ${isSelected && colors
                      ? `${colors.bg} ${colors.text} border-transparent ring-2 ring-offset-1 ring-current ring-opacity-30`
                      : 'bg-warm-50 text-warm-600 border-warm-200 hover:border-warm-300 hover:bg-warm-100'
                    }`}
                >
                  {dept}
                </button>
              )
            })}
          </div>
        </div>

        {/* Role + inline template suggestions */}
        <div className="mb-5">
          <Field label="Role / Job Title">
            <input
              type="text"
              value={form.role}
              onChange={e => { set('role', e.target.value); setSelectedTemplate(null) }}
              placeholder="e.g., Product Designer"
              className={inputCls}
            />
          </Field>

          {deptTemplates.length > 0 && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                <Sparkles size={11} /> Suggested:
              </span>
              {deptTemplates.map(tpl => {
                const isApplied = selectedTemplate?.id === tpl.id
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all duration-150
                      ${isApplied
                        ? 'bg-amber-100 text-amber-700 border-amber-200'
                        : 'bg-white text-warm-600 border-warm-200 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                  >
                    {isApplied && <Check size={10} strokeWidth={3} />}
                    {tpl.name}
                    <span className={`font-normal ${isApplied ? 'text-amber-500' : 'text-warm-400'}`}>
                      · {tpl.apps.length} apps
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Start Date */}
        <Field label="Start Date">
          <DatePicker value={form.startDate} onChange={v => set('startDate', v)} />
        </Field>

      </div>

      <div className="flex justify-end mt-5">
        <button
          onClick={() => canContinue && onNext({ employee: form, template: resolvedTemplate })}
          disabled={!canContinue}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-coral-400 hover:bg-coral-500 disabled:bg-warm-200 disabled:text-warm-400 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors duration-150 shadow-warm"
        >
          Next: Review Access
          <ArrowRight size={15} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: Access Review ────────────────────────────────────────────────────

function ReviewStep({ employee, initialTemplate, templates, onProvision, onBack }) {
  const [currentTemplate, setCurrentTemplate]     = useState(initialTemplate)
  const [apps, setApps]                           = useState([...(initialTemplate?.apps ?? [])])
  const [removedApps, setRemovedApps]             = useState([])
  const [showAppModal, setShowAppModal]           = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  function toggleApp(app) {
    setApps(prev => prev.some(a => a.name === app.name) ? prev.filter(a => a.name !== app.name) : [...prev, app])
  }
  function removeApp(name) {
    const app = apps.find(a => a.name === name)
    if (app) setRemovedApps(prev => [...prev, app])
    setApps(prev => prev.filter(a => a.name !== name))
  }
  function changeTemplate(tpl) { setCurrentTemplate(tpl); setApps([...tpl.apps]); setRemovedApps([]); setShowTemplateModal(false) }

  const deptColors = departmentColors[employee.department] ?? { bg: 'bg-warm-100', text: 'text-warm-600' }

  return (
    <div className="max-w-[640px]">

      {/* Employee summary card */}
      <div className="bg-white rounded-lg border border-warm-200 p-4 mb-4 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-coral-100 flex items-center justify-center text-sm font-bold text-coral-500 flex-shrink-0">
          {initials(employee)}
        </div>
        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2">
          <SummaryField label="Name"       value={fullName(employee)} />
          <SummaryField label="Email"      value={employee.email} />
          <SummaryField label="Department" value={employee.department} chip deptColors={deptColors} />
          <SummaryField label="Role"       value={employee.role} />
          <SummaryField label="Start Date" value={formatDate(employee.startDate)} />
        </div>
      </div>

      {/* Template row */}
      <div className="bg-white rounded-lg border border-warm-200 px-4 py-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-warm-400 uppercase tracking-wider">Template</span>
          <span className="text-sm font-semibold text-warm-900">
            {currentTemplate ? currentTemplate.name : 'No template selected'}
          </span>
        </div>
        <button onClick={() => setShowTemplateModal(true)} className="text-xs font-semibold text-coral-400 hover:text-coral-500 transition-colors">
          Change template
        </button>
      </div>

      {/* App list */}
      <div className="bg-white rounded-lg border border-warm-200 overflow-hidden mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-warm-100 bg-warm-50">
          <span className="text-xs font-bold text-warm-600 uppercase tracking-wider flex items-center gap-2">
            Applications
            <span className="bg-warm-200 text-warm-600 text-[11px] font-bold px-1.5 py-0.5 rounded-full">{apps.length}</span>
          </span>
          <button onClick={() => setShowAppModal(true)} className="text-xs font-semibold text-coral-400 hover:text-coral-500 transition-colors">
            + Add App
          </button>
        </div>
        {apps.length === 0 ? (
          <div className="py-8 text-center text-sm text-warm-400">No apps selected — add some above.</div>
        ) : (
          apps.map((app, i) => (
            <div key={app.name} className={`flex items-center gap-3 px-4 py-3 group ${i < apps.length - 1 ? 'border-b border-warm-100' : ''}`}>
              <AppIcon app={app} size={32} />
              <span className="flex-1 text-sm font-medium text-warm-800">{app.name}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Will be provisioned</span>
              <button onClick={() => removeApp(app.name)} className="opacity-0 group-hover:opacity-100 p-1 rounded text-warm-400 hover:text-red-400 hover:bg-red-50 transition-all duration-150 ml-1">
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-warm-500 hover:text-warm-800 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-warm-500">
            <span className="font-semibold text-warm-900">{apps.length} app{apps.length !== 1 ? 's' : ''}</span> will be provisioned for <span className="font-semibold text-warm-900">{employee.firstName}</span>
          </span>
          <button
            onClick={() => onProvision(apps, removedApps)}
            disabled={apps.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-coral-400 hover:bg-coral-500 disabled:bg-warm-200 disabled:text-warm-400 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors duration-150 shadow-warm"
          >
            Provision Access <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {showAppModal && <AppSearchModal addedApps={apps} onToggle={toggleApp} onClose={() => setShowAppModal(false)} />}

      {showTemplateModal && (
        <div className="fixed inset-0 z-40 bg-black/20 flex items-center justify-center" onClick={() => setShowTemplateModal(false)}>
          <div className="bg-white rounded-xl shadow-warm-lg border border-warm-200 w-[360px] p-2" onClick={e => e.stopPropagation()} style={{ animation: 'modalIn 0.18s ease-out' }}>
            {templates.map(tpl => {
              const dc = departmentColors[tpl.department] ?? { bg: 'bg-warm-100', text: 'text-warm-600' }
              const isActive = currentTemplate?.id === tpl.id
              return (
                <button key={tpl.id} onClick={() => changeTemplate(tpl)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors duration-100 ${isActive ? 'bg-coral-50' : 'hover:bg-warm-50'}`}>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-warm-900">{tpl.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${dc.bg} ${dc.text}`}>{tpl.department}</span>
                      <span className="text-xs text-warm-400">{tpl.apps.length} apps</span>
                    </div>
                  </div>
                  {isActive && <Check size={15} className="text-coral-400 flex-shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Step 3: Provisioning ─────────────────────────────────────────────────────

function ProvisioningStep({ employee, apps, removedApps = [], template, onSaveOnboarding, onViewActivity, onReset }) {
  const [phase, setPhase]         = useState('confirm')
  const [statuses, setStatuses]   = useState(() => Object.fromEntries(apps.map(a => [a.name, 'idle'])))
  const [times, setTimes]         = useState({})
  const [retried, setRetried]     = useState(false)
  const [startedAt, setStartedAt] = useState(null)
  const [elapsed, setElapsed]     = useState(null)
  const timers                    = useRef([])

  const failApp = apps[Math.min(2, apps.length - 1)]

  function setStatus(name, status) { setStatuses(prev => ({ ...prev, [name]: status })) }

  function startProvisioning() {
    const STEP_MS = 750, BASE_MS = 650
    apps.forEach((app, i) => {
      const isFailApp = app.name === failApp.name
      const dur = BASE_MS + Math.floor(Math.random() * 250)
      timers.current.push(setTimeout(() => setStatus(app.name, 'provisioning'), i * STEP_MS))
      if (!isFailApp) {
        timers.current.push(setTimeout(() => {
          setTimes(prev => ({ ...prev, [app.name]: (dur / 1000).toFixed(1) + 's' }))
          setStatus(app.name, 'success')
        }, i * STEP_MS + dur))
      } else {
        timers.current.push(setTimeout(() => setStatus(app.name, 'failed'), i * STEP_MS + dur))
      }
    })
  }

  function handleConfirm() { setPhase('running'); setStartedAt(Date.now()); startProvisioning() }

  function handleRetry() {
    setStatus(failApp.name, 'retrying')
    timers.current.push(setTimeout(() => {
      setTimes(prev => ({ ...prev, [failApp.name]: (1.2 + Math.random() * 0.4).toFixed(1) + 's' }))
      setStatus(failApp.name, 'success')
      setRetried(true)
    }, 1400))
  }

  function handleSkip() {
    setStatus(failApp.name, 'skipped')
  }

  const savedRef = useRef(false)

  useEffect(() => {
    if (phase !== 'running') return
    const done = apps.every(a => ['success', 'skipped'].includes(statuses[a.name]))
    if (done) {
      const el = ((Date.now() - startedAt) / 1000).toFixed(1)
      setElapsed(el)
      setTimeout(() => {
        setPhase('done')
        if (!savedRef.current) {
          savedRef.current = true
          const today = new Date()
          const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          onSaveOnboarding?.({
            id:              `ob-${Date.now()}`,
            employee:        fullName(employee),
            initials:        initials(employee),
            email:           employee.email,
            role:            employee.role,
            department:      employee.department,
            startDate:       employee.startDate,
            template:        template?.name ?? '',
            apps:            apps.length,
            appBreakdown:    [
              ...apps.map(a => ({
                name:   a.name,
                icon:   a.icon,
                status: statuses[a.name] === 'skipped'
                  ? 'skipped'
                  : (a.name === failApp.name && retried)
                  ? 'retried'
                  : 'success',
                time:   times[a.name] ?? null,
              })),
              ...removedApps.map(a => ({
                name:   a.name,
                icon:   a.icon,
                status: 'removed',
                time:   null,
              })),
            ],
            status:          (retried || apps.some(a => statuses[a.name] === 'skipped')) ? 'partial' : 'completed',
            dateProvisioned: dateStr,
            provisionedBy:   'Alex M.',
            duration:        el + 's',
          })
        }
      }, 400)
    }
  }, [statuses, phase, apps, startedAt])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  if (phase === 'confirm') {
    return (
      <div className="fixed inset-0 z-40 bg-black/20 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-warm-lg border border-warm-200 w-[420px] p-6" style={{ animation: 'modalIn 0.2s ease-out' }}>
          <div className="w-10 h-10 rounded-full bg-coral-50 flex items-center justify-center mb-4">
            <AlertCircle size={20} className="text-coral-400" />
          </div>
          <h3 className="font-bold text-warm-900 text-base mb-2">Confirm provisioning</h3>
          <p className="text-sm text-warm-600 leading-relaxed mb-6">
            You're about to grant access to <span className="font-semibold text-warm-900">{apps.length} apps</span> for <span className="font-semibold text-warm-900">{fullName(employee)}</span>. This will create accounts and send invitation emails.
          </p>
          <div className="flex gap-3">
            <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-lg bg-coral-400 hover:bg-coral-500 text-white text-sm font-semibold transition-colors duration-150">
              Confirm & Provision
            </button>
            <button onClick={onReset} className="px-4 py-2.5 rounded-lg text-sm font-medium text-warm-500 hover:bg-warm-100 transition-colors duration-150">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[560px]">
      <div className="mb-6">
        <h2 className="text-lg font-extrabold text-warm-900">
          {phase === 'done' ? `Access provisioned for ${employee.firstName}` : `Provisioning access for ${employee.firstName}...`}
        </h2>
        {phase === 'running' && <p className="text-sm text-warm-400 mt-1">Setting up accounts — this only takes a few seconds.</p>}
      </div>

      <div className="bg-white rounded-lg border border-warm-200 overflow-hidden mb-6">
        {apps.map((app, i) => {
          const st = statuses[app.name]
          return (
            <div key={app.name} className={`flex items-center gap-3 px-4 py-3.5 transition-all duration-500
              ${st === 'success'  ? 'bg-emerald-50/50' : ''}
              ${st === 'failed'   ? 'bg-red-50/40' : ''}
              ${st === 'skipped'  ? 'bg-warm-50/60' : ''}
              ${i < apps.length - 1 ? 'border-b border-warm-100' : ''}
            `}>
              <div className={`transition-all duration-300 ${st === 'skipped' ? 'opacity-40' : 'opacity-100'}`}>
                <AppIcon app={app} size={32} />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-semibold transition-colors duration-300 ${st === 'skipped' ? 'text-warm-400' : 'text-warm-900'}`}>
                  {app.name}
                </span>
                {st === 'failed' && (
                  <p className="text-xs text-red-500 mt-0.5" style={{ animation: 'fadeInUp 0.2s ease-out' }}>
                    Connection timed out
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {st === 'idle' && <span className="text-xs text-warm-300 font-medium">Pending</span>}
                {(st === 'provisioning' || st === 'retrying') && (
                  <span className="flex items-center gap-1.5 text-xs text-warm-500 font-medium" style={{ animation: 'fadeInUp 0.15s ease-out' }}>
                    <Loader2 size={14} className="animate-spin text-coral-400" />
                    {st === 'retrying' ? 'Retrying...' : 'Provisioning...'}
                  </span>
                )}
                {st === 'success' && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500 flex-shrink-0"
                      style={{ animation: 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
                    />
                    <span style={{ animation: 'slideInRight 0.2s 0.1s ease-out both' }}>
                      Provisioned
                      {times[app.name] && <span className="text-warm-400 font-normal ml-1">{times[app.name]}</span>}
                    </span>
                  </span>
                )}
                {st === 'skipped' && (
                  <span className="text-xs text-warm-400 font-medium" style={{ animation: 'fadeInUp 0.2s ease-out' }}>
                    Skipped
                  </span>
                )}
                {st === 'failed' && (
                  <div className="flex items-center gap-1.5" style={{ animation: 'fadeInUp 0.2s ease-out' }}>
                    <button onClick={handleRetry} className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 px-2.5 py-1 rounded-lg transition-colors duration-150">
                      <RefreshCw size={12} /> Retry
                    </button>
                    <button onClick={handleSkip} className="flex items-center gap-1.5 text-xs font-semibold text-warm-500 hover:text-warm-700 bg-warm-100 hover:bg-warm-200 border border-warm-200 px-2.5 py-1 rounded-lg transition-colors duration-150">
                      Skip
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {phase === 'done' && (() => {
        const skippedCount  = apps.filter(a => statuses[a.name] === 'skipped').length
        const successCount  = apps.length - skippedCount
        const hasIssues     = retried || skippedCount > 0
        const summaryNotes  = [retried && '1 retry', skippedCount > 0 && `${skippedCount} skipped`].filter(Boolean).join(' · ')
        return (
        <>
          <div
            className={`border rounded-lg px-5 py-4 mb-6 ${hasIssues ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}
            style={{ animation: 'fadeInScale 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2
                size={18}
                className={hasIssues ? 'text-amber-500' : 'text-emerald-500'}
                style={{ animation: 'popIn 0.4s 0.1s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
              />
              <span className={`font-bold text-sm ${hasIssues ? 'text-amber-800' : 'text-emerald-800'}`}>
                {successCount}/{apps.length} apps provisioned for {fullName(employee)}
              </span>
            </div>
            <p className={`text-xs ml-6 ${hasIssues ? 'text-amber-600' : 'text-emerald-600'}`}>
              Completed in {elapsed}s{summaryNotes ? ` · ${summaryNotes}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3" style={{ animation: 'fadeUp 0.3s 0.2s ease-out both' }}>
            <button onClick={onViewActivity} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-coral-400 hover:bg-coral-500 text-white text-sm font-semibold transition-colors duration-150 shadow-warm">
              View in Onboarding
            </button>
            <button onClick={onReset} className="px-4 py-2.5 rounded-lg text-sm font-medium text-warm-700 hover:bg-warm-100 border border-warm-200 transition-colors duration-150">
              Onboard Another Employee
            </button>
          </div>
        </>
        )
      })()}

    </div>
  )
}

// ─── Field helpers ────────────────────────────────────────────────────────────

const inputCls = `w-full px-3 py-2.5 rounded-lg border border-warm-200 text-warm-900 text-sm font-medium placeholder:text-warm-300 bg-warm-50 focus:bg-white focus:border-coral-300 focus:outline-none focus:ring-2 focus:ring-coral-100 transition-colors duration-150`

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-warm-600 uppercase tracking-wider mb-2">{label}</label>
      {children}
    </div>
  )
}

function SummaryField({ label, value, chip, deptColors }) {
  return (
    <div>
      <span className="text-xs text-warm-400 uppercase tracking-wider font-bold block mb-0.5">{label}</span>
      {chip && deptColors
        ? <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${deptColors.bg} ${deptColors.text}`}>{value}</span>
        : <span className="text-sm text-warm-800 font-medium">{value}</span>
      }
    </div>
  )
}

// ─── Main shell ───────────────────────────────────────────────────────────────

export default function OnboardingFlow({ navigate, templates, onSaveOnboarding }) {
  const [step, setStep]             = useState(1)
  const [employee, setEmployee]     = useState(null)
  const [template, setTemplate]     = useState(null)
  const [apps, setApps]             = useState([])
  const [removedApps, setRemovedApps] = useState([])

  const readyTemplates = templates.filter(t => !t.needsAttention)

  function handleStep1({ employee: emp, template: tpl }) {
    setEmployee(emp); setTemplate(tpl); setApps(tpl?.apps ?? []); setStep(2)
  }

  function resetFlow() { setStep(1); setEmployee(null); setTemplate(null); setApps([]); setRemovedApps([]) }

  return (
    <div>
      <button onClick={() => navigate('onboarding')} className="flex items-center gap-1.5 text-sm text-warm-500 hover:text-warm-800 mb-6 transition-colors duration-150">
        <ArrowLeft size={15} /> Back to Onboarding
      </button>
      <h1 className="text-xl font-extrabold text-warm-900 mb-8">New Onboarding</h1>
      <Stepper currentStep={step} />

      {step === 1 && <EmployeeStep templates={readyTemplates} onNext={handleStep1} />}
      {step === 2 && employee && (
        <ReviewStep
          employee={employee}
          initialTemplate={template}
          templates={readyTemplates}
          onProvision={(provisioned, removed) => { setApps(provisioned); setRemovedApps(removed); setStep(3) }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && employee && (
        <ProvisioningStep
          employee={employee}
          apps={apps}
          removedApps={removedApps}
          template={template}
          onSaveOnboarding={onSaveOnboarding}
          onViewActivity={() => navigate('onboarding', { toast: 'Access provisioned successfully' })}
          onReset={resetFlow}
        />
      )}
    </div>
  )
}
