import { SURFACE_CAPABILITIES } from '@/shared/surface'
import { getVisibility } from './getVisibility'
import StrokeGroup from './StrokeGroup'

import type { StrokeAppearance } from '@/shared/strokeStyle'
import type { SurfaceRenderer } from '@/shared/surface'

// ===== TYPES =================================================================
type BorderGroupProps = {
  label: string
  renderer?: SurfaceRenderer
  value: StrokeAppearance
  onChange: (value: StrokeAppearance) => void
}

// ===== COMPONENT =============================================================
/**
 * Border group of a box or a mark, e.g. of a legend or the bars: a stroke
 * with an eye that hides it and keeps its values. What the renderer draws
 * comes from `SURFACE_CAPABILITIES`: a gradient only where it can be
 * drawn, e.g. not in the CSS of a tooltip.
 * @param props Name, renderer, border and handler.
 */
function BorderGroup({
  label,
  renderer = 'html',
  value,
  onChange,
}: BorderGroupProps) {
  const { borderGradient } = SURFACE_CAPABILITIES[renderer]
  return (
    <StrokeGroup
      label={`${label} border`}
      paintTypes={borderGradient ? undefined : ['solid']}
      title="Border"
      value={value.stroke}
      visibility={getVisibility(value, onChange)}
      onChange={(stroke) => onChange({ ...value, stroke })}
    />
  )
}

export default BorderGroup
