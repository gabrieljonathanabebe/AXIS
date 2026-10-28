import { Equal } from 'lucide-react'

import { hasStrokeColor } from '../strokeStyle'
import { createStyleColorPresets } from './colorPresets'
import ControlRow from './ControlRow'
import PaintControl from './PaintControl'
import ScrubbableNumber from './ScrubbableNumber'
import SegmentedControl from './SegmentedControl'

import type { ReactNode } from 'react'
import type { ColorValue } from '../colorValue'
import type { LineStyle, SeriesStrokeStyle } from '../strokeStyle'

// ===== TYPES =================================================================
type StrokeStyleControlsProps<TStroke extends SeriesStrokeStyle> = {
  defaultColor?: ColorValue
  details?: ReactNode
  label: string
  maxWidth?: number
  minWidth?: number
  seriesColor?: ReactNode
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
 * Rows of one stroke, e.g. a border: width and line style, then color,
 * opacity and the gear of `details`, if given. Widgets place them next to
 * their own rows and pass the color the stroke gets when created as
 * `defaultColor`; a stroke without a color, e.g. a series line, shows
 * `seriesColor` in its place.
 */
function StrokeStyleControls<TStroke extends SeriesStrokeStyle>({
  defaultColor,
  details,
  label,
  maxWidth = 8,
  minWidth = 0,
  seriesColor,
  value,
  onChange,
}: StrokeStyleControlsProps<TStroke>) {
  return (
    <>
      <ControlRow>
        <ScrubbableNumber
          icon={<Equal size={14} />}
          label={`${label} width`}
          max={maxWidth}
          min={minWidth}
          step={1}
          unit="px"
          value={value.width}
          onValueChange={(width) => onChange({ ...value, width })}
        />
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
      <PaintControl
        color={
          hasStrokeColor(value) && defaultColor
            ? {
                presets: createStyleColorPresets(defaultColor),
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
    </>
  )
}

export default StrokeStyleControls
