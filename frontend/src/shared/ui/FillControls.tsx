import ColorControl from './ColorControl'
import ControlRow from './ControlRow'
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
 * Rows for color and opacity of one solid fill, e.g. the area below a
 * line. Widgets place them next to their own rows; a fill without a color,
 * e.g. of scatter points, gets no color row.
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
