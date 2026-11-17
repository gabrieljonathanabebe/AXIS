import { Ruler } from 'lucide-react'

import ControlRow from '../../shared/ui/ControlRow'
import FormatWidget from '../../shared/ui/FormatWidget'
import NumberFormatControls from '../../shared/ui/NumberFormatControls'
import RotationDial from '../../shared/ui/RotationDial'
import ScrubbableNumber from '../../shared/ui/ScrubbableNumber'
import TextInput from '../../shared/ui/TextInput'
import TextStyleControls from '../../shared/ui/TextStyleControls'

import type { AxisLabelsAppearance, AxisTitleAppearance } from '../types'

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
    Partial<Pick<AxisLabelsAppearance, 'rotation' | 'valueType'>>
  title: AxisTitleAppearance
}

/** Part of the axis: its title group or the groups of its labels. */
type AxisWidgetPart = 'labels' | 'title'

type AxisWidgetProps<TValue extends AxisParts> = {
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
  defaultTitle,
  label,
  value,
  part,
  titleGroup,
  onChange,
}: AxisWidgetProps<TValue>) {
  const { labels } = value
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
          isDate={labels.valueType === 'date'}
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
      </FormatWidget>
    </>
  )
}

export default AxisWidget
