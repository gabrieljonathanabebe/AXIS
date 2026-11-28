import { Equal } from 'lucide-react'

import NumberControl from '../controls/NumberControl'
import SegmentedControl from '../controls/SegmentedControl'
import PaintRow from '../rows/PaintRow'
import Row from '../rows/Row'
import Group from './Group'

import type { ReactNode } from 'react'
import type { Paint, PaintType, SeriesPaint } from '@/shared/paint'
import type { LineStyle, StrokeStyle } from '@/shared/strokeStyle'
import type { RowDetails } from '../rows/Row'
import type { GroupHeadProps } from './Group'

// ===== TYPES =================================================================
type StrokeGroupProps<TStroke extends StrokeStyle<Paint | SeriesPaint>> =
  GroupHeadProps & {
    details?: RowDetails
    label: string
    maxWidth?: number
    minWidth?: number
    paintTypes?: PaintType[]
    seriesColor?: ReactNode
    /** What the stroke is, e.g. "Border" or "Gridlines". */
    title: string
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
 * Group of one stroke, e.g. a border, the gridlines of an axis or the line
 * of a line chart: first the row of its paint (`PaintRow`) with color and
 * opacity, its type behind the swatch or the gear of `details`, then width
 * and line style. A stroke in the series color, e.g. the line, shows
 * `seriesColor` in its place. An eye comes only through `visibility`; a
 * shown stroke is at least 1 px.
 * @param props Heading, stroke, its bounds, paint types and handler.
 */
function StrokeGroup<TStroke extends StrokeStyle<Paint | SeriesPaint>>({
  details,
  group,
  label,
  maxWidth = 8,
  minWidth = 1,
  paintTypes,
  seriesColor,
  title,
  value,
  visibility,
  onChange,
}: StrokeGroupProps<TStroke>) {
  return (
    <Group group={group} title={title} visibility={visibility}>
      <PaintRow
        details={details}
        label={label}
        paintTypes={paintTypes}
        seriesColor={seriesColor}
        value={value}
        onChange={onChange}
      />
      <Row>
        <NumberControl
          icon={<Equal size={14} />}
          label={`${label} width`}
          max={maxWidth}
          min={minWidth}
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
      </Row>
    </Group>
  )
}

export default StrokeGroup
