import { Plus, CheckCircle2, AlertTriangle } from 'lucide-react'
import { departmentColors } from '../data/mockData.js'

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

function StatusBadge({ status }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 size={11} />
        Completed
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
      <AlertTriangle size={11} />
      Partial
    </span>
  )
}

export default function OnboardingList({ navigate, onboardingHistory }) {
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

      {/* Table */}
      <div className="bg-white rounded-lg border border-warm-200 overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_0.8fr] gap-4 px-5 py-3 border-b border-warm-100 bg-warm-50">
          {['Employee', 'Role & Department', 'Date', 'Apps', 'Status'].map((h) => (
            <span key={h} className="text-xs font-bold text-warm-400 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {/* Rows */}
        {onboardingHistory.map((entry, i) => {
          const deptColors = departmentColors[entry.department] ?? { bg: 'bg-warm-100', text: 'text-warm-600' }
          return (
            <div
              key={entry.id}
              className={`grid grid-cols-[2fr_1.5fr_1fr_1fr_0.8fr] gap-4 px-5 py-4 items-center hover:bg-warm-50 transition-colors duration-100 ${i < onboardingHistory.length - 1 ? 'border-b border-warm-100' : ''}`}
            >
              {/* Employee */}
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor(entry.employee)}`}>
                  {entry.initials}
                </div>
                <span className="text-sm font-semibold text-warm-900">{entry.employee}</span>
              </div>

              {/* Role & Department */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-warm-700">{entry.role}</span>
                <span className={`text-xs font-semibold w-fit px-1.5 py-0.5 rounded-full ${deptColors.bg} ${deptColors.text}`}>
                  {entry.department}
                </span>
              </div>

              {/* Date */}
              <span className="text-sm text-warm-500">{entry.dateProvisioned}</span>

              {/* Apps */}
              <span className="text-sm text-warm-700 font-medium">{entry.apps} apps</span>

              {/* Status */}
              <StatusBadge status={entry.status} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
