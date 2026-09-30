import { PanelLeftClose, PanelRightClose } from 'lucide-react'
import type { ReactNode } from 'react'

import IconBadge from './IconBadge'
import IconButton from './IconButton'

type PanelSide = 'start' | 'end'

type PanelProps = {
  as?: 'aside' | 'section'
  heading?: ReactNode
  icon?: ReactNode
  title?: string
  className?: string
  actions?: ReactNode
  children?: ReactNode
  isCollapsed?: boolean
  isScrollable?: boolean
  side?: PanelSide
  onToggleCollapse?: () => void
}

function Panel({
  as: Element = 'section',
  heading,
  icon,
  title,
  className = '',
  actions,
  children,
  isCollapsed = false,
  isScrollable = false,
  side = 'start',
  onToggleCollapse,
}: PanelProps) {
  const CollapseIcon = side === 'start' ? PanelLeftClose : PanelRightClose

  const collapseButton = onToggleCollapse ? (
    <IconButton
      label={`Hide ${title}`}
      size="sm"
      aria-expanded
      onClick={onToggleCollapse}
    >
      <CollapseIcon size={16} />
    </IconButton>
  ) : null
  const titleContent =
    heading ?? (title ? <IconBadge label={title}>{icon}</IconBadge> : null)
  return (
    <Element
      className={`panel glass glass-thin ${isScrollable ? 'is-scrollable' : ''} ${isCollapsed ? 'is-collapsed' : ''} ${className}`}
    >
      {isCollapsed ? (
        <IconButton
          label={`Show ${title}`}
          aria-expanded={false}
          onClick={onToggleCollapse}
        >
          {icon}
        </IconButton>
      ) : (
        <header className="panel-header">
          {titleContent ? (
            <h2 className="panel-title">{titleContent}</h2>
          ) : null}
          {actions || collapseButton ? (
            <div className="panel-actions">
              {actions}
              {collapseButton}
            </div>
          ) : null}
        </header>
      )}
      {children ? (
        <div className="panel-content" hidden={isCollapsed}>
          {children}
        </div>
      ) : null}
    </Element>
  )
}

export default Panel
