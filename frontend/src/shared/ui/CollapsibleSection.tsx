import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'

import Button from './Button'
import IconBadge from './IconBadge'
import Widget from './Widget'

type CollapsibleSectionVariant = 'plain' | 'widget'

type CollapsibleSectionProps = {
  title: string
  icon?: React.ReactNode
  meta?: React.ReactNode
  actions?: React.ReactNode
  defaultOpen?: boolean
  forceOpen?: boolean
  variant?: CollapsibleSectionVariant
  children: React.ReactNode
}

function CollapsibleSection({
  title,
  icon,
  meta,
  actions,
  defaultOpen = true,
  forceOpen = false,
  variant = 'widget',
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()
  const isExpanded = forceOpen || isOpen

  const toggleOpen = () => {
    setIsOpen((currentValue) => !currentValue)
  }

  const content = (
    <>
      <div className="collapsible-section-header">
        <Button
          className="collapsible-section-trigger"
          type="button"
          aria-controls={contentId}
          aria-expanded={isExpanded}
          onClick={toggleOpen}
        >
          <span className="collapsible-section-heading inline-cluster">
            {icon ? (
              <IconBadge label={title}>{icon}</IconBadge>
            ) : (
              <span className="collapsible-section-title">{title}</span>
            )}
            {meta !== undefined ? (
              <span className="collapsible-section-meta">{meta}</span>
            ) : null}
          </span>
        </Button>
        {actions}
        <Button
          className="collapsible-section-chevron"
          type="button"
          aria-controls={contentId}
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
          onClick={toggleOpen}
        >
          <ChevronDown
            className={isExpanded ? 'is-open' : undefined}
            size={16}
          />
        </Button>
      </div>

      {isExpanded ? (
        <div className="collapsible-section-content" id={contentId}>
          {children}
        </div>
      ) : null}
    </>
  )

  if (variant === 'plain') {
    return <section className="collapsible-section is-plain">{content}</section>
  }

  return <Widget className="collapsible-section glass">{content}</Widget>
}

export default CollapsibleSection
