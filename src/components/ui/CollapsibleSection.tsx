import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Button from './Button'
import IconBadge from './IconBadge'
import Widget from './Widget'

type CollapsibleSectionProps = {
  title: string
  icon?: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}

function CollapsibleSection({
  title,
  icon,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Widget className="collapsible-section">
      <Button
        className="collapsible-section-trigger"
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        {icon ? (
          <IconBadge label={title}>{icon}</IconBadge>
        ) : (
          <span>{title}</span>
        )}

        <ChevronDown className={isOpen ? 'is-open' : undefined} size={16} />
      </Button>

      {isOpen ? (
        <div className="collapsible-section-content">{children}</div>
      ) : null}
    </Widget>
  )
}

export default CollapsibleSection
