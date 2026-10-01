import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Button from './Button'
import IconBadge from './IconBadge'
import Widget from './Widget'

type CollapsibleSectionVariant = 'plain' | 'widget'

type CollapsibleSectionProps = {
  title: string
  icon?: React.ReactNode
  meta?: React.ReactNode
  defaultOpen?: boolean
  forceOpen?: boolean
  variant?: CollapsibleSectionVariant
  children: React.ReactNode
}

function CollapsibleSection({
  title,
  icon,
  meta,
  defaultOpen = true,
  forceOpen = false,
  variant = 'widget',
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const isExpanded = forceOpen || isOpen

  const content = (
    <>
      <Button
        className="collapsible-section-trigger"
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
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
        <ChevronDown className={isExpanded ? 'is-open' : undefined} size={16} />
      </Button>

      {isExpanded ? (
        <div className="collapsible-section-content">{children}</div>
      ) : null}
    </>
  )

  if (variant === 'plain') {
    return <section className="collapsible-section is-plain">{content}</section>
  }

  return <Widget className="collapsible-section glass">{content}</Widget>
}

export default CollapsibleSection
