import ControlRow from '../../shared/ui/ControlRow'
import FormatWidget from '../../shared/ui/FormatWidget'
import RotationDial from '../../shared/ui/RotationDial'
import ScrubbableNumber from '../../shared/ui/ScrubbableNumber'
import SegmentedControl from '../../shared/ui/SegmentedControl'
import SelectControl from '../../shared/ui/SelectControl'
import TextInput from '../../shared/ui/TextInput'
import TextStyleControls from '../../shared/ui/TextStyleControls'
import {
  CURRENCY_OPTIONS,
  VALUE_FORMAT_OPTIONS,
} from '../../shared/format/valueFormats'

import type { AxisAppearance, AxisFormat } from '../types'

// ===== TYPES =================================================================
type AxisOrientation = 'x' | 'y'

/** Rows of one part of the axis; without a part the widget shows both. */
type AxisWidgetPart = 'labels' | 'title'

type AxisWidgetProps = {
  defaultTitle?: string
  onChange: (value: AxisAppearance) => void
  orientation: AxisOrientation
  part?: AxisWidgetPart
  value: AxisAppearance
}

type TickMode = 'auto' | 'custom'

// ===== CONSTANTS =============================================================
const formatOptions = [
  ...VALUE_FORMAT_OPTIONS,
  { label: 'Date', value: 'date' },
] satisfies { label: string; value: AxisFormat }[]

const tickModeOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Custom', value: 'custom' },
] satisfies { label: string; value: TickMode }[]

const DEFAULT_TICK_COUNT = 5

// ===== FUNCTIONS =============================================================
/**
 * Formats one axis: visibility, title and labels. With `part` it shows only
 * the title or only the label rows, e.g. per element in the format popover.
 */
function AxisWidget({
  defaultTitle,
  orientation,
  value,
  part,
  onChange,
}: AxisWidgetProps) {
  const title = orientation === 'x' ? 'X Axis' : 'Y Axis'
  const { labels, titleStyle } = value
  const tickMode: TickMode = labels.tickCount === null ? 'auto' : 'custom'
  const showsTitle = part !== 'labels'
  const showsLabels = part !== 'title'
  return (
    <FormatWidget
      title={title}
      visibility={
        showsTitle
          ? {
              visible: value.visible,
              onChange: (visible) => {
                onChange({ ...value, visible })
              },
            }
          : undefined
      }
    >
      {showsTitle ? (
        <>
          <ControlRow label="Title">
            <TextInput
              label={`${title} title`}
              value={value.title}
              placeholder={defaultTitle || 'Automatic'}
              onValueChange={(axisTitle) => {
                onChange({
                  ...value,
                  title: axisTitle,
                })
              }}
            />
          </ControlRow>
          <TextStyleControls
            label={`${title} title`}
            rowLabelPrefix="Title"
            value={titleStyle}
            onChange={(style) => onChange({ ...value, titleStyle: style })}
          />
        </>
      ) : null}
      {showsLabels ? (
        <>
          <ControlRow label="Format">
            <SelectControl
              label={`${title} format`}
              options={formatOptions}
              value={value.format}
              onChange={(format) => {
                onChange({
                  ...value,
                  format,
                })
              }}
            />
          </ControlRow>
          {value.format === 'currency' ? (
            <div className="format-widget-subproperties">
              <ControlRow label="Currency">
                <SelectControl
                  label={`${title} currency`}
                  options={CURRENCY_OPTIONS}
                  value={value.currency}
                  onChange={(currency) => {
                    onChange({
                      ...value,
                      currency,
                    })
                  }}
                />
              </ControlRow>
            </div>
          ) : null}
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
                    onChange({
                      ...value,
                      labels: { ...labels, tickCount },
                    })
                  }}
                />
              </ControlRow>
            </div>
          ) : null}
          <ControlRow label="Label rotation">
            <RotationDial
              label={`${title} label rotation`}
              value={labels.rotation}
              onValueChange={(rotation) => {
                onChange({
                  ...value,
                  labels: { ...labels, rotation },
                })
              }}
            />
          </ControlRow>
          <TextStyleControls
            label={`${title} label`}
            rowLabelPrefix="Label"
            value={labels.textStyle}
            onChange={(textStyle) =>
              onChange({ ...value, labels: { ...labels, textStyle } })
            }
          />
        </>
      ) : null}
    </FormatWidget>
  )
}

export default AxisWidget
