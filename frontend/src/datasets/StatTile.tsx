import IconBadge from '@/shared/ui/display/IconBadge'
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
    <Tile className="stat-tile stack">
      <IconBadge className="stat-tile-label" label={label}>
        {icon}
      </IconBadge>
      <strong className="stat-tile-value">{value}</strong>
      {share !== undefined ? (
        <span className="stat-tile-meter" aria-hidden>
          <span
            className="stat-tile-meter-fill"
            style={{ width: `${share * 100}%` }}
          />
        </span>
      ) : null}
      {hint ? (
        <span className="stat-tile-hint" title={hint}>
          {hint}
        </span>
      ) : null}
    </Tile>
  )
}

export default StatTile
