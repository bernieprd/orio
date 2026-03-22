import { useState, useCallback } from 'react'
import Toast from '../components/Toast.jsx'
import {
  Plus, CheckCircle2, AlertTriangle, Layers,
  X, User, Mail, Briefcase, Calendar, XCircle,
  Users, Zap, Clock, AlertOctagon,
} from 'lucide-react'
import { departmentColors, appColors, appsCatalog } from '../data/mockData.js'

const AVATAR_COLORS = [
  'bg-violet-100 text-violet-600',
  'bg-blue-100 text-blue-600',
  'bg-emerald-100 text-emerald-600',
  'bg-amber-100 text-amber-600',
  'bg-rose-100 text-rose-600',
]

function avatarColor(str) {
  let n = 0
  for (let i = 0; i < str.length; i++) n += str.charCodeAt(i)
  return AVATAR_COLORS[n % AVATAR_COLORS.length]
}

function getAppIcon(name) {
  return appsCatalog.find(a => a.name === name)?.icon ?? name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function AppIcon({ name, icon, size = 28 }) {
  const color = appColors[icon ?? getAppIcon(name)] ?? '#8F8B82'
  return (
    <div
      title={name}
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.38 }}
      className="rounded-md flex items-center justify-center flex-shrink-0 text-white font-bold shadow-sm"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function StatusBadge({ status }) {
  if (status === 'completed') return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
      <CheckCircle2 size={11} /> Completed
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
      <AlertTriangle size={11} /> Partial
    </span>
  )
}

function StatCard({ icon, label, value, sub, warning }) {
  return (
    <div className={`bg-white rounded-lg border p-5 ${warning ? 'border-amber-200' : 'border-warm-200'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${warning ? 'bg-amber-50' : 'bg-coral-50'}`}>
        <span className={warning ? 'text-amber-400' : 'text-coral-400'}>{icon}</span>
      </div>
      <div className={`text-3xl font-extrabold mb-1 ${warning ? 'text-amber-500' : 'text-warm-900'}`}>
        {value}
      </div>
      <div className={`text-sm font-semibold ${warning ? 'text-amber-600' : 'text-warm-700'}`}>{label}</div>
      <div className="text-xs text-warm-400 mt-0.5">{sub}</div>
    </div>
  )
}

function InfoField({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-warm-400 mb-1">{icon} {label}</div>
      <div className="text-sm font-medium text-warm-800">{value || '—'}</div>
    </div>
  )
}

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatStartDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return `${MONTHS_SHORT[m - 1]} ${d}, ${y}`
}

function DetailDrawer({ entry, onClose }) {
  const deptColors = departmentColors[entry.department] ?? { bg: 'bg-warm-100', text: 'text-warm-600' }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-[440px] bg-white border-l border-warm-200 flex flex-col"
        style={{ animation: 'drawerIn 0.22s ease-out', boxShadow: '-8px 0 32px rgba(0,0,0,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${avatarColor(entry.employee)}`}>
              {entry.initials}
            </div>
            <div>
              <div className="font-bold text-warm-900 text-sm">{entry.employee}</div>
              <div className="text-xs text-warm-400">{entry.time} · by {entry.provisionedBy}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-warm-400 hover:text-warm-700 hover:bg-warm-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* Employee info */}
          <div className="px-6 py-5 border-b border-warm-100">
            <h3 className="text-xs font-bold text-warm-400 uppercase tracking-wider mb-4">Employee</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoField icon={<User size={12} />}      label="Name"       value={entry.employee} />
              <InfoField icon={<Mail size={12} />}      label="Email"      value={entry.email} />
              <InfoField icon={<Briefcase size={12} />} label="Role"       value={entry.role} />
              <div>
                <div className="flex items-center gap-1.5 text-xs text-warm-400 mb-1">
                  <Layers size={12} /> Department
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${deptColors.bg} ${deptColors.text}`}>
                  {entry.department}
                </span>
              </div>
              {entry.startDate && (
                <InfoField icon={<Calendar size={12} />} label="Start Date" value={formatStartDate(entry.startDate)} />
              )}
            </div>
          </div>

          {/* Provisioning summary */}
          <div className="px-6 py-5 border-b border-warm-100">
            <h3 className="text-xs font-bold text-warm-400 uppercase tracking-wider mb-4">Provisioning</h3>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm">
                <span className="text-warm-400">Template: </span>
                <span className="font-semibold text-warm-900">{entry.template || '—'}</span>
              </div>
              <StatusBadge status={entry.status} />
            </div>
            <div className="flex items-center gap-4 text-xs text-warm-500">
              <span><span className="font-semibold text-warm-700">{entry.apps}</span> apps provisioned</span>
              <span><span className="font-semibold text-warm-700">{entry.duration}</span> total time</span>
            </div>
            <div className="text-xs text-warm-400 mt-2">Estimated monthly license cost: €425/mo</div>
          </div>

          {/* App breakdown */}
          {entry.appBreakdown?.length > 0 && (
            <div className="px-6 py-5">
              <h3 className="text-xs font-bold text-warm-400 uppercase tracking-wider mb-4">App Breakdown</h3>
              <div className="flex flex-col gap-2">
                {entry.appBreakdown.map(app => (
                  <div
                    key={app.name}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border
                      ${app.status === 'success'  ? 'bg-emerald-50/50 border-emerald-100' :
                        app.status === 'retried'  ? 'bg-amber-50/50 border-amber-100' :
                        app.status === 'skipped'  ? 'bg-warm-50 border-warm-200' :
                        app.status === 'removed'  ? 'bg-warm-50 border-warm-200 opacity-60' :
                                                    'bg-red-50/50 border-red-100'}`}
                  >
                    <AppIcon name={app.name} icon={app.icon} size={28} />
                    <span className={`flex-1 text-sm font-medium ${app.status === 'skipped' || app.status === 'removed' ? 'text-warm-400' : 'text-warm-800'}`}>
                      {app.name}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {app.time && <span className="text-xs text-warm-400">{app.time}</span>}
                      {app.status === 'success' && <CheckCircle2 size={15} className="text-emerald-500" />}
                      {app.status === 'retried' && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <AlertTriangle size={12} /> Retried
                        </span>
                      )}
                      {app.status === 'skipped' && (
                        <span className="text-xs font-semibold text-warm-400">Skipped</span>
                      )}
                      {app.status === 'removed' && (
                        <span className="text-xs font-semibold text-warm-400">Removed</span>
                      )}
                      {app.status === 'failed' && <XCircle size={15} className="text-red-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-warm-100 bg-warm-50 flex-shrink-0">
          <p className="text-xs text-warm-400">
            Provisioned by <span className="font-semibold text-warm-600">{entry.provisionedBy}</span> on {entry.dateProvisioned ?? entry.time}
          </p>
        </div>
      </div>

    </>
  )
}

export default function OnboardingList({ navigate, activityFeed, toast: initialToast }) {
  const [selected, setSelected] = useState(null)
  const [toast, setToast]       = useState(initialToast ?? null)
  const dismissToast = useCallback(() => setToast(null), [])

  const totalApps = activityFeed.reduce((sum, e) => sum + (e.apps ?? 0), 0)
  const durations = activityFeed.map(e => parseFloat(e.duration)).filter(n => !isNaN(n))
  const avgTime   = durations.length
    ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1) + 's'
    : '—'
  const failCount = activityFeed.filter(e => e.status === 'partial' || e.status === 'failed').length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-warm-900">Onboarding</h1>
          <p className="text-sm text-warm-400 mt-0.5">
            Provision app access for new employees in seconds.
          </p>
        </div>
        <button
          onClick={() => navigate('onboarding-new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-coral-400 hover:bg-coral-500 active:bg-coral-600 text-white text-sm font-semibold transition-colors duration-150 shadow-warm"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Onboarding
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Users size={16} />}
          label="Employees Onboarded"
          value={activityFeed.length}
          sub="all time"
        />
        <StatCard
          icon={<Zap size={16} />}
          label="Apps Provisioned"
          value={totalApps}
          sub="all time"
        />
        <StatCard
          icon={<Clock size={16} />}
          label="Avg. Provision Time"
          value={avgTime}
          sub="per onboarding"
        />
        <StatCard
          icon={<AlertOctagon size={16} />}
          label="Failed Provisions"
          value={failCount}
          sub="retried or partial"
          warning={failCount > 0}
        />
      </div>

      {/* Feed */}
      <div className="bg-white rounded-lg border border-warm-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-warm-100 bg-warm-50">
          <span className="text-xs font-bold text-warm-400 uppercase tracking-wider">Recent Activity</span>
        </div>

        {activityFeed.length === 0 ? (
          <div className="py-16 text-center text-sm text-warm-400">
            No onboardings yet. Click "New Onboarding" to get started.
          </div>
        ) : (
          activityFeed.map((entry, i) => {
            const deptColors = departmentColors[entry.department] ?? { bg: 'bg-warm-100', text: 'text-warm-600' }
            return (
              <div
                key={entry.id}
                onClick={() => setSelected(entry)}
                className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-warm-50 transition-colors duration-100 ${i < activityFeed.length - 1 ? 'border-b border-warm-100' : ''}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor(entry.employee)}`}>
                  {entry.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-warm-900">{entry.employee}</span>
                    {entry.department && (
                      <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${deptColors.bg} ${deptColors.text}`}>
                        {entry.department}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-warm-500 mt-0.5">
                    Onboarded with template: <span className="font-medium text-warm-700">{entry.template}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-warm-500 flex-shrink-0">
                  <Layers size={12} />
                  {entry.apps} apps
                </div>

                <div className="flex-shrink-0">
                  <StatusBadge status={entry.status} />
                </div>

                <div className="text-xs text-warm-400 flex-shrink-0 text-right min-w-[80px]">
                  <div>{entry.time}</div>
                  <div className="mt-0.5">by {entry.provisionedBy}</div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {selected && <DetailDrawer entry={selected} onClose={() => setSelected(null)} />}
      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  )
}
