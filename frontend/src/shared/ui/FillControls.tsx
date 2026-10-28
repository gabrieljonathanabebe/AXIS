import { hasFillColor } from '../fill'
import { DATA_COLOR_PRESETS } from './colorPresets'
import PaintControl from './PaintControl'

import type { ReactNode } from 'react'
import type { SeriesFill } from '../fill'

// ===== TYPES =================================================================
type FillControlsProps<TFill extends SeriesFill> = {
  details?: ReactNode
  label: string
  seriesColor?: ReactNode
  value: TFill
  onChange: (value: TFill) => void
}

// ===== COMPONENT =============================================================
/**
 * Color row of one solid fill: its color and opacity, then the gear of
 * `details`, if given. Widgets place it next to their own rows; a series
 * fill, e.g. the area below a line or scatter points, shows `seriesColor`
 * in place of an own color.
 */
function FillControls<TFill extends SeriesFill>({
  details,
  label,
  seriesColor,
  value,
  onChange,
}: FillControlsProps<TFill>) {
  return (
    <PaintControl
      color={
        hasFillColor(value)
          ? {
              presets: DATA_COLOR_PRESETS,
              value: value.color,
              onChange: (color) => onChange({ ...value, color }),
            }
          : undefined
      }
      details={details}
      label={label}
      opacity={value.opacity}
      seriesColor={seriesColor}
      onOpacityChange={(opacity) => onChange({ ...value, opacity })}
    />
  )
}

export default FillControls
