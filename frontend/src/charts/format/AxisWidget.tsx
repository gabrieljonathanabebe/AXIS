import { Ruler } from 'lucide-react'

import { showsDateLabels } from '@/charts/getEffectiveTimeGrain'
import ControlRow from '@/shared/ui/ControlRow'
import DateFormatSelect from '@/shared/ui/DateFormatSelect'
import FormatWidget from '@/shared/ui/FormatWidget'
import NumberFormatControls from '@/shared/ui/NumberFormatControls'
import RotationDial from '@/shared/ui/RotationDial'
import ScrubbableNumber from '@/shared/ui/ScrubbableNumber'
import TextInput from '@/shared/ui/TextInput'
import TextStyleControls from '@/shared/ui/TextStyleControls'

import type { AxisLabelsAppearance, AxisTitleAppearance } from '@/charts/types'
import type { TimeGrain } from '@/shared/format/valueFormats'

// ===== TYPES =================================================================
/**
 * Parts the groups edit, shared by an axis and the color scale; rotation
 * and dates exist only at an axis.
 */
type AxisParts = {
  labels: Pick<
    AxisLabelsAppearance,
    'numberFormat' | 'textStyle' | 'tickCount'
  > &
    Partial<Pick<AxisLabelsAppearance, 'dateFormat' | 'rotation' | 'valueType'>>
  title: AxisTitleAppearance
}

/** Part of the axis: its title group or the groups of its labels. */
type AxisWidgetPart = 'labels' | 'title'

type AxisWidgetProps<TValue extends AxisParts> = {
  /** Field and grain of the axis dates; only the X axis of a chart has one. */
  dateAxis?: { grain: TimeGrain | null; hasDateField: boolean }
  defaultTitle?: string
  /** Name of the element in the control labels, e.g. "X Axis". */
  label: string
  onChange: (value: TValue) => void
  part: AxisWidgetPart
  /** Element whose click opens the title group, e.g. of a color scale. */
  titleGroup?: string
  value: TValue
}

// ===== FUNCTIONS =============================================================
/**
 * Groups of one axis part: the title group, or the subgroups of its labels
 * (ticks, rotation, text and format as number or date), which the element
 * shows in its Labels group. The color scale has the same groups, without
 * rotation and dates. Whether the element shows is the eye in the panel
 * header.
 */
function AxisWidget<TValue extends AxisParts>({
  dateAxis,
  defaultTitle,
  label,
  value,
  part,
  titleGroup,
  onChange,
}: AxisWidgetProps<TValue>) {
  const { labels } = value
  const isDate =
    labels.valueType !== undefined &&
    showsDateLabels(
      { numberFormat: labels.numberFormat, valueType: labels.valueType },
      dateAxis?.hasDateField ?? false,
    )
  if (part === 'title') {
    return (
      <FormatWidget
        group={titleGroup}
        title="Title"
        visibility={{
          visible: value.title.visible,
          onChange: (visible) => {
            onChange({ ...value, title: { ...value.title, visible } })
          },
        }}
      >
        <ControlRow layout="wide">
          <TextInput
            label={`${label} title`}
            value={value.title.text}
            placeholder={defaultTitle || 'Automatic'}
            onValueChange={(text) => {
              onChange({ ...value, title: { ...value.title, text } })
            }}
          />
        </ControlRow>
        <TextStyleControls
          label={`${label} title`}
          value={value.title.textStyle}
          onChange={(textStyle) =>
            onChange({ ...value, title: { ...value.title, textStyle } })
          }
        />
      </FormatWidget>
    )
  }
  return (
    <>
      <FormatWidget title="Layout">
        <ControlRow>
          <ScrubbableNumber
            icon={<Ruler size={14} />}
            label={`${label} tick count`}
            max={20}
            min={2}
            step={1}
            value={labels.tickCount}
            onAuto={() => {
              onChange({ ...value, labels: { ...labels, tickCount: null } })
            }}
            onValueChange={(tickCount) => {
              onChange({ ...value, labels: { ...labels, tickCount } })
            }}
          />
          {labels.rotation === undefined ? null : (
            <RotationDial
              label={`${label} label rotation`}
              value={labels.rotation}
              onValueChange={(rotation) => {
                onChange({ ...value, labels: { ...labels, rotation } })
              }}
            />
          )}
        </ControlRow>
      </FormatWidget>
      <FormatWidget title="Text">
        <TextStyleControls
          label={`${label} label`}
          value={labels.textStyle}
          onChange={(textStyle) =>
            onChange({ ...value, labels: { ...labels, textStyle } })
          }
        />
      </FormatWidget>
      <FormatWidget title="Format">
        <NumberFormatControls
          isDate={isDate}
          label={label}
          value={labels.numberFormat}
          onChange={(numberFormat) => {
            const next = { ...labels, numberFormat }
            onChange({
              ...value,
              labels: labels.valueType
                ? { ...next, valueType: 'number' }
                : next,
            })
          }}
          onDate={
            labels.valueType
              ? () => {
                  onChange({
                    ...value,
                    labels: { ...labels, valueType: 'date' },
                  })
                }
              : undefined
          }
        />
        {isDate && labels.dateFormat && (
          <DateFormatSelect
            grain={dateAxis?.grain ?? null}
            label={label}
            value={labels.dateFormat}
            onChange={(dateFormat) => {
              onChange({ ...value, labels: { ...labels, dateFormat } })
            }}
          />
        )}
      </FormatWidget>
    </>
  )
}

export default AxisWidget
