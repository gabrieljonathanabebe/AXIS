import { hasFillColor } from '../fill'
import { DATA_COLOR_PRESETS } from './colorPresets'
import PaintControl from './PaintControl'

import type { ReactNode } from 'react'
import type { SeriesFill } from '../fill'
import type { ColorPreset } from './ColorControl'

// ===== TYPES =================================================================
type FillControlsProps<TFill extends SeriesFill> = {
  details?: ReactNode
  label: string
  presets?: ColorPreset[]
  seriesColor?: ReactNode
  value: TFill
  onChange: (value: TFill) => void
}

// ===== COMPONENT =============================================================
/**
 * Color row of one solid fill: its color and opacity, then the gear of
 * `details`, if given. Widgets place it next to their own rows; a series
 * fill, e.g. the area below a line or scatter points, shows `seriesColor`
 * in place of an own color. `presets` are its swatches, data colors unless
 * a place passes others, e.g. none for a background.
 */
function FillControls<TFill extends SeriesFill>({
  details,
  label,
  presets = DATA_COLOR_PRESETS,
  seriesColor,
  value,
  onChange,
}: FillControlsProps<TFill>) {
  return (
    <PaintControl
      color={
        hasFillColor(value)
          ? {
              presets,
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
