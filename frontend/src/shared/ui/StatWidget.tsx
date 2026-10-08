import type { ReactNode } from 'react'

import IconBadge from './IconBadge'
import Widget from './Widget'

type StatWidgetProps = {
  hint?: string
  icon: ReactNode
  label: string
  share?: number
  value: string
}

function StatWidget({ hint, icon, label, share, value }: StatWidgetProps) {
  return (
    <Widget className="stat-widget stack">
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
    </Widget>
  )
}

export default StatWidget
