import StyleGallery from '../dashboardStyle/StyleGallery'
import { STYLE_RECIPES } from '../dashboardStyle/styleRecipes'
import { addFill } from '../shared/fill'
import FillListControls from '../shared/ui/FillListControls'
import FormatPanel from '../shared/ui/FormatPanel'
import FormatWidget from '../shared/ui/FormatWidget'
import LayoutControls from '../shared/ui/LayoutControls'
import AnimationWidget from './AnimationWidget'

import type { Fill } from '../shared/fill'
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
      <FormatWidget title="Style">
        <StyleGallery
          recipes={STYLE_RECIPES}
          value={dashboard.style}
          onApply={actions.applyStyle}
        />
      </FormatWidget>
      <FormatWidget title="Layout">
        <LayoutControls
          label="Dashboard"
          value={dashboard.layout}
          onChange={actions.updateDashboardLayout}
        />
      </FormatWidget>
      <FormatWidget
        title="Background"
        onAdd={() => updateBackground(addFill(dashboard.canvas.background))}
      >
        <FillListControls
          label="Canvas"
          value={dashboard.canvas.background}
          onChange={updateBackground}
        />
      </FormatWidget>
      <AnimationWidget
        value={dashboard.animation}
        onChange={(animation) => actions.updateDashboard({ animation })}
      />
    </FormatPanel>
  )
}

export default DashboardFormatPanel
