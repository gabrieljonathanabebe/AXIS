import ColorControl from './ColorControl'
import ControlRow from './ControlRow'
import { DATA_COLOR_PRESETS } from './colorPresets'
import { hasFillColor } from '../fill'
import Slider from './Slider'

import type { SeriesFill } from '../fill'

// ===== TYPES =================================================================
type FillControlsProps<TFill extends SeriesFill> = {
  label: string
  value: TFill
  onChange: (value: TFill) => void
}

// ===== COMPONENT =============================================================
/**
 * Rows for color and opacity of one solid fill. Widgets place them next
 * to their own rows; a series fill, e.g. the area below a line or scatter
 * points, gets no color row because its color comes from the series.
 */
function FillControls<TFill extends SeriesFill>({
  label,
  value,
  onChange,
}: FillControlsProps<TFill>) {
  return (
    <>
      {hasFillColor(value) ? (
        <ControlRow label="Color">
          <ColorControl
            label={`${label} color`}
            presets={DATA_COLOR_PRESETS}
            value={value.color}
            onChange={(color) => onChange({ ...value, color })}
          />
        </ControlRow>
      ) : null}
      <ControlRow label="Opacity">
        <Slider
          label={`${label} opacity`}
          max={1}
          min={0.05}
          step={0.05}
          value={value.opacity}
          onValueChange={(opacity) => onChange({ ...value, opacity })}
        />
      </ControlRow>
    </>
  )
}

export default FillControls
