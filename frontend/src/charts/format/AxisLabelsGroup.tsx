import { Ruler } from 'lucide-react'

import { showsDateLabels } from '@/charts/getEffectiveTimeGrain'
import RotationDial from '@/shared/ui/controls/RotationDial'
import ScrubbableNumber from '@/shared/ui/controls/ScrubbableNumber'
import Group from '@/shared/ui/groups/Group'
import NumberFormatControls from '@/shared/ui/groups/NumberFormatControls'
import TextStyleControls from '@/shared/ui/groups/TextStyleControls'
import Row from '@/shared/ui/rows/Row'
import DateFormatRow from './DateFormatRow'

import type { AxisLabelsAppearance } from '@/charts/types'
import type { TimeGrain } from '@/shared/format/valueFormats'
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
  return (
    <Group group={group} title="Labels" visibility={visibility}>
      <Group title="Layout">
        <Row>
          <ScrubbableNumber
            icon={<Ruler size={14} />}
            label={`${label} tick count`}
            max={20}
            min={2}
            step={1}
            value={value.tickCount}
            onAuto={() => onChange({ ...value, tickCount: null })}
            onValueChange={(tickCount) => onChange({ ...value, tickCount })}
          />
          {value.rotation === undefined ? null : (
            <RotationDial
              label={`${label} label rotation`}
              value={value.rotation}
              onValueChange={(rotation) => onChange({ ...value, rotation })}
            />
          )}
        </Row>
      </Group>
      <Group title="Text">
        <TextStyleControls
          label={`${label} label`}
          value={value.textStyle}
          onChange={(textStyle) => onChange({ ...value, textStyle })}
        />
      </Group>
      <Group title="Format">
        <NumberFormatControls
          isDate={isDate}
          label={label}
          value={value.numberFormat}
          onChange={(numberFormat) => {
            const next = { ...value, numberFormat }
            onChange(value.valueType ? { ...next, valueType: 'number' } : next)
          }}
          onDate={
            value.valueType
              ? () => onChange({ ...value, valueType: 'date' })
              : undefined
          }
        />
        {isDate && value.dateFormat && (
          <DateFormatRow
            grain={dateAxis?.grain ?? null}
            label={label}
            value={value.dateFormat}
            onChange={(dateFormat) => onChange({ ...value, dateFormat })}
          />
        )}
      </Group>
    </Group>
  )
}

export default AxisLabelsGroup
