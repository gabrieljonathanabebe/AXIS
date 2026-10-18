import { Eye, EyeOff } from 'lucide-react'
import type { ReactNode } from 'react'

import CollapsibleSection from '../shared/ui/CollapsibleSection'
import ControlRow from '../shared/ui/ControlRow'
import IconButton from '../shared/ui/IconButton'
import Toggle from '../shared/ui/Toggle'

export type InspectorWidgetVariant = 'bare' | 'section'

type InspectorWidgetProps = {
  title: string
  icon?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  visibility?: {
    label?: string
    visible: boolean
    onChange: (visible: boolean) => void
  }
  variant?: InspectorWidgetVariant
}

function InspectorWidget({
  title,
  icon,
  children,
  defaultOpen = true,
  variant = 'section',
  visibility,
}: InspectorWidgetProps) {
  const content = (
    <div className="stack inspector-widget-content">{children}</div>
  )
  // Bare renders only the controls, e.g. in a format popover; visibility
  // becomes a row, since there is no header for the eye button.
  if (variant === 'bare') {
    const visibilityLabel = visibility?.label ?? 'Visible'
    return (
      <div className="stack inspector-widget-content">
        {visibility ? (
          <ControlRow label={visibilityLabel}>
            <Toggle
              checked={visibility.visible}
              label={`${title} ${visibilityLabel.toLowerCase()}`}
              onCheckedChange={visibility.onChange}
            />
          </ControlRow>
        ) : null}
        {children}
      </div>
    )
  }
  return (
    <CollapsibleSection
      title={title}
      icon={icon}
      defaultOpen={defaultOpen}
      variant="plain"
      actions={
        visibility ? (
          <IconButton
            size="xs"
            variant="ghost"
            label={`${visibility.visible ? 'Hide' : 'Show'} ${title}`}
            isActive={visibility.visible}
            onClick={() => {
              visibility.onChange(!visibility.visible)
            }}
          >
            {visibility.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </IconButton>
        ) : undefined
      }
    >
      {content}
    </CollapsibleSection>
  )
}

export default InspectorWidget
