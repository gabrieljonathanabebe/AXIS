import { hasFillColor } from '../fill'
import { DATA_COLOR_PRESETS } from './colorPresets'
import PaintControl from './PaintControl'

import type { ReactNode } from 'react'
import type { SeriesFill } from '../fill'

// ===== TYPES =================================================================
type FillControlsProps<TFill extends SeriesFill> = {
  label: string
  /** Field of the series color for a fill without own color. */
  seriesColor?: ReactNode
  value: TFill
  onChange: (value: TFill) => void
}

// ===== COMPONENT =============================================================
/**
 * Color row of one solid fill: its color and opacity. Widgets place it
 * next to their own rows; a series fill, e.g. the area below a line or
 * scatter points, shows `seriesColor` in place of an own color.
 */
function FillControls<TFill extends SeriesFill>({
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
      label={label}
      opacity={value.opacity}
      seriesColor={seriesColor}
      onOpacityChange={(opacity) => onChange({ ...value, opacity })}
    />
  )
}

export default FillControls
