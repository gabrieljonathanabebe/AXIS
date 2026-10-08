import { Eye, EyeOff } from 'lucide-react'
import type { ReactNode } from 'react'

import CollapsibleSection from '../shared/ui/CollapsibleSection'
import IconButton from '../shared/ui/IconButton'

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
      <div className="stack inspector-widget-content">{children}</div>
    </CollapsibleSection>
  )
}

export default InspectorWidget
