import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import { useId, useState } from 'react'
import type { ReactNode } from 'react'

import IconBadge from '../ui/IconBadge'
import IconButton from '../ui/IconButton'
import Widget from '../ui/Widget'

type InspectorWidgetProps = {
  title: string
  icon?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  visibility?: {
    visible: boolean
    onChange: (visible: boolean) => void
  }
}

function InspectorWidget({
  title,
  icon,
  children,
  defaultOpen = true,
  visibility,
}: InspectorWidgetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <Widget className="inspector-widget">
      <div className="inspector-widget-header">
        <button
          className="inspector-widget-trigger"
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((current) => !current)}
        >
          {icon ? (
            <IconBadge label={title}>{icon}</IconBadge>
          ) : (
            <span>{title}</span>
          )}
        </button>
        {visibility ? (
          <IconButton
            size="sm"
            label={`${visibility.visible ? 'Hide' : 'Show'} ${title}`}
            isActive={visibility.visible}
            onClick={() => {
              visibility.onChange(!visibility.visible)
            }}
          >
            {visibility.visible ? <Eye size={15} /> : <EyeOff size={15} />}
          </IconButton>
        ) : null}
        <button
          className="inspector-widget-chevron"
          type="button"
          aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((current) => !current)}
        >
          <ChevronDown className={isOpen ? '' : 'is-closed'} size={16} />
        </button>
      </div>
      {isOpen ? (
        <div className="stack inspector-widget-content" id={contentId}>
          {children}
        </div>
      ) : null}
    </Widget>
  )
}

export default InspectorWidget
