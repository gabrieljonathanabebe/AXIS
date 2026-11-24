import StyleGallery from '@/dashboardStyle/StyleGallery'
import { STYLE_RECIPES } from '@/dashboardStyle/styleRecipes'
import FormatPanel from '@/shared/ui/containers/FormatPanel'
import BackgroundGroup from '@/shared/ui/groups/BackgroundGroup'
import Group from '@/shared/ui/groups/Group'
import LayoutGroup from '@/shared/ui/groups/LayoutGroup'
import AnimationGroup from './AnimationGroup'

import type { Fill } from '@/shared/fill'
import type { CanvasActions, DashboardSpec } from './types'

// ===== TYPES =================================================================
type DashboardFormatPanelProps = {
  actions: CanvasActions
  dashboard: DashboardSpec
  isCollapsed: boolean
  onToggleCollapse: () => void
}

// ===== COMPONENT =============================================================
/**
 * Format panel without a selection, like in Power BI: the settings of the
 * whole dashboard, its style, the gap between objects, the canvas
 * background and the animation of all charts. The name stays inline on
 * the canvas.
 */
function DashboardFormatPanel({
  actions,
  dashboard,
  isCollapsed,
  onToggleCollapse,
}: DashboardFormatPanelProps) {
  /** Changes the canvas fills; the other canvas settings stay. */
  function updateBackground(background: Fill[]): void {
    actions.updateDashboard({ canvas: { ...dashboard.canvas, background } })
  }

  return (
    <FormatPanel
      isCollapsed={isCollapsed}
      label="Dashboard"
      onToggleCollapse={onToggleCollapse}
    >
      <Group title="Style">
        <StyleGallery
          recipes={STYLE_RECIPES}
          value={dashboard.style}
          onApply={actions.applyStyle}
        />
      </Group>
      <Group title="Layout">
        <LayoutGroup
          label="Dashboard"
          value={dashboard.layout}
          onChange={actions.updateDashboardLayout}
        />
      </Group>
      <BackgroundGroup
        label="Canvas"
        value={dashboard.canvas.background}
        onChange={updateBackground}
      />
      <AnimationGroup
        value={dashboard.animation}
        onChange={(animation) => actions.updateDashboard({ animation })}
      />
    </FormatPanel>
  )
}

export default DashboardFormatPanel
