import { useState } from 'react'
import { appColors, appLogoDomains } from '../data/mockData.js'

export default function AppIcon({ name, icon, size = 32 }) {
  const [failed, setFailed] = useState(false)
  const key    = icon ?? name?.toLowerCase().replace(/[^a-z0-9]/g, '')
  const domain = appLogoDomains[key]
  const color  = appColors[key] ?? '#8F8B82'
  const radius = size <= 24 ? 'rounded-md' : 'rounded-lg'

  if (domain && !failed) {
    return (
      <div
        title={name}
        style={{ width: size, height: size }}
        className={`${radius} overflow-hidden flex-shrink-0 shadow-sm bg-white border border-warm-100 flex items-center justify-center`}
      >
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={name}
          style={{ width: size * 0.72, height: size * 0.72, objectFit: 'contain' }}
          onError={() => setFailed(true)}
        />
      </div>
    )
  }

  return (
    <div
      title={name}
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.38 }}
      className={`${radius} flex items-center justify-center flex-shrink-0 text-white font-bold shadow-sm`}
    >
      {name?.charAt(0).toUpperCase()}
    </div>
  )
}
