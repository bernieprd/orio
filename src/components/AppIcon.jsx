import {
  siFigma, siNotion, siJira, siLinear,
  siGithub, siGitlab, siHubspot, siDatadog, siSentry,
  siLoom, siMiro, siConfluence, si1password,
  siZoom, siIntercom, siZendesk, siAsana, siAirtable,
  siPostman, siDocker, siTerraform, siGoogle,
} from 'simple-icons'
import { appColors } from '../data/mockData.js'

const SI_MAP = {
  figma:       siFigma,
  notion:      siNotion,
  jira:        siJira,
  linear:      siLinear,
  github:      siGithub,
  gitlab:      siGitlab,
  hubspot:     siHubspot,
  datadog:     siDatadog,
  sentry:      siSentry,
  loom:        siLoom,
  miro:        siMiro,
  confluence:  siConfluence,
  '1password': si1password,
  zoom:        siZoom,
  intercom:    siIntercom,
  zendesk:     siZendesk,
  asana:       siAsana,
  airtable:    siAirtable,
  postman:     siPostman,
  docker:      siDocker,
  terraform:   siTerraform,
  google:      siGoogle,
}

export default function AppIcon({ name, icon, size = 32 }) {
  const key    = icon ?? name?.toLowerCase().replace(/[^a-z0-9]/g, '')
  const si     = SI_MAP[key]
  const radius = size <= 24 ? 'rounded-md' : 'rounded-lg'

  if (si) {
    const bg = `#${si.hex}`
    const iconSize = size * 0.58
    return (
      <div
        title={name}
        style={{ backgroundColor: bg, width: size, height: size }}
        className={`${radius} flex items-center justify-center flex-shrink-0 shadow-sm`}
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          style={{ width: iconSize, height: iconSize }}
          fill="white"
        >
          <path d={si.path} />
        </svg>
      </div>
    )
  }

  // Fallback: colored initial square
  const color = appColors[key] ?? '#8F8B82'
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
