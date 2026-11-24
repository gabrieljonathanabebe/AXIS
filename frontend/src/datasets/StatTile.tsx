import IconBadge from '@/shared/ui/primitives/IconBadge'
import Tile from '@/shared/ui/tiles/Tile'

import type { ReactNode } from 'react'

type StatTileProps = {
  hint?: string
  icon: ReactNode
  label: string
  share?: number
  value: string
}

function StatTile({ hint, icon, label, share, value }: StatTileProps) {
  return (
    <Tile className="stat-widget stack">
      <IconBadge className="stat-widget-label" label={label}>
        {icon}
      </IconBadge>
      <strong className="stat-widget-value">{value}</strong>
      {share !== undefined ? (
        <span className="stat-widget-meter" aria-hidden>
          <span
            className="stat-widget-meter-fill"
            style={{ width: `${share * 100}%` }}
          />
        </span>
      ) : null}
      {hint ? (
        <span className="stat-widget-hint" title={hint}>
          {hint}
        </span>
      ) : null}
    </Tile>
  )
}

export default StatTile
