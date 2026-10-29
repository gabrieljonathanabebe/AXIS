import { DATA_COLOR_PRESETS } from './colorPresets'
import PaintControl from './PaintControl'

import type { ReactNode } from 'react'
import type { Fill } from '../fill'
import type { Paint, PaintType, SeriesPaint } from '../paint'
import type { ColorPreset } from './ColorControl'

// ===== TYPES =================================================================
type FillControlsProps<TFill extends Fill<Paint | SeriesPaint>> = {
  details?: ReactNode
  label: string
  paintTypes?: PaintType[]
  presets?: ColorPreset[]
  seriesColor?: ReactNode
  value: TFill
  onChange: (value: TFill) => void
}

// ===== COMPONENT =============================================================
/**
 * Rows of one fill: the rows of its paint (`PaintControl`) with type,
 * color, opacity and the gear of `details`, if given. Widgets place them
 * next to their own rows; a fill in the series color, e.g. the area below
 * a line or scatter points, shows `seriesColor` in place of an own color.
 * `presets` are its swatches, data colors unless a place passes others,
 * e.g. none for a background.
 */
function FillControls<TFill extends Fill<Paint | SeriesPaint>>({
  details,
  label,
  paintTypes,
  presets = DATA_COLOR_PRESETS,
  seriesColor,
  value,
  onChange,
}: FillControlsProps<TFill>) {
  return (
    <PaintControl
      details={details}
      label={label}
      paintTypes={paintTypes}
      presets={presets}
      seriesColor={seriesColor}
      value={value}
      onChange={onChange}
    />
  )
}

export default FillControls
