import ControlRow from '../../shared/ui/ControlRow'
import FormatWidget from '../../shared/ui/FormatWidget'
import NumberFormatControls from '../../shared/ui/NumberFormatControls'
import RotationDial from '../../shared/ui/RotationDial'
import ScrubbableNumber from '../../shared/ui/ScrubbableNumber'
import SegmentedControl from '../../shared/ui/SegmentedControl'
import TextInput from '../../shared/ui/TextInput'
import TextStyleControls from '../../shared/ui/TextStyleControls'
import { CHART_TEXT_STYLE } from '../createChartInstance'

import type { AxisAppearance, AxisValueType } from '../types'

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

type TickMode = 'auto' | 'custom'

// ===== CONSTANTS =============================================================
const valueTypeOptions = [
  { label: 'Number', value: 'number' },
  { label: 'Date', value: 'date' },
] satisfies { label: string; value: AxisValueType }[]

const tickModeOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Custom', value: 'custom' },
] satisfies { label: string; value: TickMode }[]

const DEFAULT_TICK_COUNT = 5

// ===== FUNCTIONS =============================================================
/**
 * Groups of one axis part: the title group of the axis element, or the
 * groups of the axis labels element (values, rotation, text and number
 * format). Whether the axis shows is the element toggle in the header.
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
  const tickMode: TickMode = labels.tickCount === null ? 'auto' : 'custom'
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
        <ControlRow label="Text">
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
          defaultColor={CHART_TEXT_STYLE.color}
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
      <FormatWidget title="Content">
        <ControlRow label="Type">
          <SegmentedControl
            label={`${title} value type`}
            options={valueTypeOptions}
            value={labels.valueType}
            onValueChange={(valueType) => {
              onChange({ ...value, labels: { ...labels, valueType } })
            }}
          />
        </ControlRow>
        <ControlRow label="Ticks">
          <SegmentedControl
            label={`${title} tick mode`}
            options={tickModeOptions}
            value={tickMode}
            onValueChange={(nextTickMode) => {
              onChange({
                ...value,
                labels: {
                  ...labels,
                  tickCount:
                    nextTickMode === 'auto' ? null : DEFAULT_TICK_COUNT,
                },
              })
            }}
          />
        </ControlRow>
        {labels.tickCount !== null ? (
          <div className="format-widget-subproperties">
            <ControlRow label="Tick count">
              <ScrubbableNumber
                label={`${title} tick count`}
                min={2}
                max={20}
                step={1}
                value={labels.tickCount}
                onValueChange={(tickCount) => {
                  onChange({ ...value, labels: { ...labels, tickCount } })
                }}
              />
            </ControlRow>
          </div>
        ) : null}
      </FormatWidget>
      <FormatWidget title="Layout">
        <ControlRow label="Rotation">
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
          defaultColor={CHART_TEXT_STYLE.color}
          label={`${title} label`}
          value={labels.textStyle}
          onChange={(textStyle) =>
            onChange({ ...value, labels: { ...labels, textStyle } })
          }
        />
      </FormatWidget>
      {labels.valueType === 'number' ? (
        <FormatWidget title="Format">
          <NumberFormatControls
            label={title}
            value={labels.numberFormat}
            onChange={(numberFormat) => {
              onChange({ ...value, labels: { ...labels, numberFormat } })
            }}
          />
        </FormatWidget>
      ) : null}
    </>
  )
}

export default AxisWidget
