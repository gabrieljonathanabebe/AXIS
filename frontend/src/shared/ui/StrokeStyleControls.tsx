import { Equal } from 'lucide-react'

import ControlRow from './ControlRow'
import PaintControl from './PaintControl'
import ScrubbableNumber from './ScrubbableNumber'
import SegmentedControl from './SegmentedControl'

import type { ReactNode } from 'react'
import type { Paint, PaintType, SeriesPaint } from '../paint'
import type { LineStyle, StrokeStyle } from '../strokeStyle'

// ===== TYPES =================================================================
type StrokeStyleControlsProps<
  TStroke extends StrokeStyle<Paint | SeriesPaint>,
> = {
  details?: ReactNode
  label: string
  maxWidth?: number
  minWidth?: number
  paintTypes?: PaintType[]
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
 * Rows of one stroke, e.g. a border: first the row of its paint
 * (`PaintControl`) with color and opacity, its type behind the swatch or
 * the gear of `details`, then width and line style. Every group thus
 * starts with its color row. A stroke in the series color, e.g. a line
 * mark, shows `seriesColor` in its place.
 */
function StrokeStyleControls<TStroke extends StrokeStyle<Paint | SeriesPaint>>({
  details,
  label,
  maxWidth = 8,
  minWidth = 0,
  paintTypes,
  seriesColor,
  value,
  onChange,
}: StrokeStyleControlsProps<TStroke>) {
  return (
    <>
      <PaintControl
        details={details}
        label={label}
        paintTypes={paintTypes}
        seriesColor={seriesColor}
        value={value}
        onChange={onChange}
      />
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
    </>
  )
}

export default StrokeStyleControls
