import { Settings2 } from 'lucide-react'
import { useState } from 'react'

import FormatWidget from '../shared/ui/FormatWidget'
import IconButton from '../shared/ui/IconButton'
import LayoutControls from '../shared/ui/LayoutControls'
import Popover from '../shared/ui/Popover'
import AnimationWidget from './AnimationWidget'

import type { CanvasActions, DashboardSpec } from './types'

// ===== TYPES =================================================================
type DashboardSettingsPopoverProps = {
  actions: CanvasActions
  dashboard: DashboardSpec
}

// ===== COMPONENT =============================================================
/**
 * Toolbar button with the settings of the whole dashboard: the gap between
 * objects and the animation of all charts. The name stays inline on the
 * canvas.
 */
function DashboardSettingsPopover({
  actions,
  dashboard,
}: DashboardSettingsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover
      className="format-popover glass glass-thick"
      label="Dashboard settings"
      open={isOpen}
      placement="bottom-start"
      title="Dashboard"
      onOpenChange={setIsOpen}
      renderTrigger={(triggerProps) => (
        <IconButton
          {...triggerProps}
          isActive={isOpen}
          label="Dashboard settings"
          size="sm"
          variant="ghost"
          onClick={() => setIsOpen((current) => !current)}
        >
          <Settings2 size={16} />
        </IconButton>
      )}
    >
      <div className="format-popover-body stack">
        <FormatWidget title="Layout">
          <LayoutControls
            label="Dashboard"
            value={dashboard.layout}
            onChange={actions.updateDashboardLayout}
          />
        </FormatWidget>
        <AnimationWidget
          value={dashboard.animation}
          onChange={(animation) => actions.updateDashboard({ animation })}
        />
      </div>
    </Popover>
  )
}

export default DashboardSettingsPopover
