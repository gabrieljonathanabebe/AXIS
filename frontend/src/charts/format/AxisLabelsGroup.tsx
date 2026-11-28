import { Ruler } from 'lucide-react'

import { showsDateLabels } from '@/charts/getEffectiveTimeGrain'
import NumberControl from '@/shared/ui/controls/NumberControl'
import Group from '@/shared/ui/groups/Group'
import NumberFormatGroup from '@/shared/ui/groups/NumberFormatGroup'
import TextGroup from '@/shared/ui/groups/TextGroup'
import Row from '@/shared/ui/rows/Row'

import type { AxisLabelsAppearance } from '@/charts/types'
import type { DateFormat, TimeGrain } from '@/shared/format/valueFormats'
import type { FormatVisibility } from '@/shared/ui/groups/Group'

// ===== TYPES =================================================================
/**
 * Labels the group edits, shared by an axis and the color scale; rotation
 * and dates exist only at an axis.
 */
type AxisLabelsParts = Pick<
  AxisLabelsAppearance,
  'numberFormat' | 'textStyle' | 'tickCount'
> &
  Partial<Pick<AxisLabelsAppearance, 'dateFormat' | 'rotation' | 'valueType'>>

type AxisLabelsGroupProps<TLabels extends AxisLabelsParts> = {
  /** Field and grain of the axis dates; only the X axis of a chart has one. */
  dateAxis?: { grain: TimeGrain | null; hasDateField: boolean }
  /** Element whose click opens the group, e.g. the labels of the X axis. */
  group: string
  /** Name of the element in the control labels, e.g. "X Axis". */
  label: string
  value: TLabels
  visibility?: FormatVisibility
  onChange: (value: TLabels) => void
}

// ===== COMPONENT =============================================================
/**
 * Labels group of an axis or the color scale with its subgroups: ticks and
 * rotation, text, and the format as number or date. The color scale has
 * no rotation and no dates; only its labels have an eye.
 * @param props Labels, their element and name, dates of the axis,
 *   visibility and handler.
 */
function AxisLabelsGroup<TLabels extends AxisLabelsParts>({
  dateAxis,
  group,
  label,
  value,
  visibility,
  onChange,
}: AxisLabelsGroupProps<TLabels>) {
  const isDate =
    value.valueType !== undefined &&
    showsDateLabels(
      { numberFormat: value.numberFormat, valueType: value.valueType },
      dateAxis?.hasDateField ?? false,
    )
  /** Dates as a choice of the format; only the labels of an axis have them. */
  const dateChoice =
    value.valueType && value.dateFormat
      ? {
          grain: dateAxis?.grain ?? null,
          isChosen: isDate,
          value: value.dateFormat,
          onChange: (dateFormat: DateFormat) =>
            onChange({ ...value, dateFormat }),
          onChoose: () => onChange({ ...value, valueType: 'date' }),
        }
      : undefined
  return (
    <Group group={group} title="Labels" visibility={visibility}>
      <Group title="Layout">
        <Row>
          <NumberControl
            icon={<Ruler size={14} />}
            label={`${label} tick count`}
            max={20}
            min={2}
            value={value.tickCount}
            onAuto={() => onChange({ ...value, tickCount: null })}
            onValueChange={(tickCount) => onChange({ ...value, tickCount })}
          />
          {value.rotation === undefined ? null : (
            <NumberControl
              label={`${label} label rotation`}
              unit="degree"
              value={value.rotation}
              onValueChange={(rotation) => onChange({ ...value, rotation })}
            />
          )}
        </Row>
      </Group>
      <TextGroup
        label={`${label} label`}
        value={value.textStyle}
        onChange={(textStyle) => onChange({ ...value, textStyle })}
      />
      <NumberFormatGroup
        date={dateChoice}
        label={label}
        value={value.numberFormat}
        onChange={(numberFormat) => {
          const next = { ...value, numberFormat }
          onChange(value.valueType ? { ...next, valueType: 'number' } : next)
        }}
      />
    </Group>
  )
}

export default AxisLabelsGroup
