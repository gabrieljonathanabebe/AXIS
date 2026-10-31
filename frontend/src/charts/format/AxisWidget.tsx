import { Ruler } from 'lucide-react'

import ControlRow from '../../shared/ui/ControlRow'
import FormatWidget from '../../shared/ui/FormatWidget'
import NumberFormatControls from '../../shared/ui/NumberFormatControls'
import RotationDial from '../../shared/ui/RotationDial'
import ScrubbableNumber from '../../shared/ui/ScrubbableNumber'
import TextInput from '../../shared/ui/TextInput'
import TextStyleControls from '../../shared/ui/TextStyleControls'

import type { AxisAppearance } from '../types'

// ===== TYPES =================================================================
type AxisOrientation = 'x' | 'y'

/** Part of the axis: its title group or the groups of its labels. */
type AxisWidgetPart = 'labels' | 'title'

type AxisWidgetProps = {
  defaultTitle?: string
  onChange: (value: AxisAppearance) => void
  orientation: AxisOrientation
  part: AxisWidgetPart
  value: AxisAppearance
}

// ===== FUNCTIONS =============================================================
/**
 * Groups of one axis part: the title group of the axis element, or the
 * groups of the axis labels element (ticks, rotation, text and format as
 * number or date). Whether the axis shows is the eye in the popover
 * header.
 */
function AxisWidget({
  defaultTitle,
  orientation,
  value,
  part,
  onChange,
}: AxisWidgetProps) {
  const title = orientation === 'x' ? 'X Axis' : 'Y Axis'
  const { labels } = value
  if (part === 'title') {
    return (
      <FormatWidget
        title="Title"
        visibility={{
          visible: value.title.visible,
          onChange: (visible) => {
            onChange({ ...value, title: { ...value.title, visible } })
          },
        }}
      >
        <ControlRow>
          <TextInput
            label={`${title} title`}
            value={value.title.text}
            placeholder={defaultTitle || 'Automatic'}
            onValueChange={(text) => {
              onChange({ ...value, title: { ...value.title, text } })
            }}
          />
        </ControlRow>
        <TextStyleControls
          label={`${title} title`}
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
            label={`${title} tick count`}
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
          <RotationDial
            label={`${title} label rotation`}
            value={labels.rotation}
            onValueChange={(rotation) => {
              onChange({ ...value, labels: { ...labels, rotation } })
            }}
          />
        </ControlRow>
      </FormatWidget>
      <FormatWidget title="Text">
        <TextStyleControls
          label={`${title} label`}
          value={labels.textStyle}
          onChange={(textStyle) =>
            onChange({ ...value, labels: { ...labels, textStyle } })
          }
        />
      </FormatWidget>
      <FormatWidget title="Format">
        <NumberFormatControls
          isDate={labels.valueType === 'date'}
          label={title}
          value={labels.numberFormat}
          onChange={(numberFormat) => {
            onChange({
              ...value,
              labels: { ...labels, numberFormat, valueType: 'number' },
            })
          }}
          onDate={() => {
            onChange({ ...value, labels: { ...labels, valueType: 'date' } })
          }}
        />
      </FormatWidget>
    </>
  )
}

export default AxisWidget
