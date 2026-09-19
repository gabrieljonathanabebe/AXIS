import type { ReactNode } from 'react'

import IconBadge from '../ui/IconBadge'
import Widget from '../ui/Widget'

type InspectorWidgetProps = {
  title: string
  icon?: ReactNode
  children: ReactNode
}

function InspectorWidget({ title, icon, children }: InspectorWidgetProps) {
  return (
    <Widget className="inspector-widget">
      <div className="inspector-widget-header">
        {icon ? (
          <IconBadge label={title}>{icon}</IconBadge>
        ) : (
          <span>{title}</span>
        )}
      </div>
      <div className="stack inspector-widget-content">{children}</div>
    </Widget>
  )
}

export default InspectorWidget
