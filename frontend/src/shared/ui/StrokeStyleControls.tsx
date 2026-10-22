import ColorControl from './ColorControl'
import ControlRow from './ControlRow'
import { getRowLabel } from './getRowLabel'
import { hasStrokeColor } from '../strokeStyle'
import ScrubbableNumber from './ScrubbableNumber'
import SegmentedControl from './SegmentedControl'
import Slider from './Slider'

import type { LineStyle, SeriesStrokeStyle } from '../strokeStyle'

// ===== TYPES =================================================================
type StrokeStyleControlsProps<TStroke extends SeriesStrokeStyle> = {
  label: string
  maxWidth?: number
  minWidth?: number
  rowLabelPrefix?: string
  value: TStroke
  onChange: (value: TStroke) => void
}

// ===== CONSTANTS =============================================================
const lineStyleOptions = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
] satisfies { label: string; value: LineStyle }[]

// ===== COMPONENT =============================================================
/**
 * Rows for width, line style, color and opacity of one stroke, e.g. a
 * border. Widgets place them next to their own rows; a stroke without a
 * color, e.g. a series line, gets no color row.
 */
function StrokeStyleControls<TStroke extends SeriesStrokeStyle>({
  label,
  maxWidth = 8,
  minWidth = 0,
  rowLabelPrefix,
  value,
  onChange,
}: StrokeStyleControlsProps<TStroke>) {
  return (
    <>
      <ControlRow label={getRowLabel('Width', rowLabelPrefix)}>
        <ScrubbableNumber
          label={`${label} width`}
          max={maxWidth}
          min={minWidth}
          step={1}
          value={value.width}
          onValueChange={(width) => onChange({ ...value, width })}
        />
      </ControlRow>
      <ControlRow label={getRowLabel('Style', rowLabelPrefix)}>
        <SegmentedControl
          label={`${label} line style`}
          options={lineStyleOptions}
          renderOption={(option) => (
            <span
              aria-hidden="true"
              className="line-style-preview"
              style={{ borderTopStyle: option.value }}
            />
          )}
          value={value.lineStyle}
          onValueChange={(lineStyle) => onChange({ ...value, lineStyle })}
        />
      </ControlRow>
      {hasStrokeColor(value) ? (
        <ControlRow label={getRowLabel('Color', rowLabelPrefix)}>
          <ColorControl
            label={`${label} color`}
            value={value.color}
            onChange={(color) => onChange({ ...value, color })}
          />
        </ControlRow>
      ) : null}
      <ControlRow label={getRowLabel('Opacity', rowLabelPrefix)}>
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

export default StrokeStyleControls
