import { MoveHorizontal, MoveVertical } from 'lucide-react'

import ColorControl from '../../ui/ColorControl'
import ControlRow from '../../ui/ControlRow'
import FontWeightControl from '../../ui/FontWeightControl'
import InspectorWidget from '../InspectorWidget'
import RotationDial from '../../ui/RotationDial'
import ScrubbableNumber from '../../ui/ScrubbableNumber'
import SegmentedControl from '../../ui/SegmentedControl'
import SelectControl from '../../ui/SelectControl'
import TextInput from '../../ui/TextInput'

import type {
  AxisAppearance,
  AxisFormat,
  CurrencyCode,
} from '../../../types/chart'

// ===== TYPES =================================================================
type AxisOrientation = 'x' | 'y'

type AxisWidgetProps = {
  orientation: AxisOrientation
  value: AxisAppearance
  onChange: (value: AxisAppearance) => void
}

type TickMode = 'auto' | 'custom'

// ===== CONSTANTS =============================================================
const formatOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Number', value: 'number' },
  { label: 'Percent', value: 'percent' },
  { label: 'Currency', value: 'currency' },
  { label: 'Date', value: 'date' },
] satisfies { label: string; value: AxisFormat }[]

const currencyOptions = [
  { label: 'EUR', value: 'EUR' },
  { label: 'USD', value: 'USD' },
  { label: 'GBP', value: 'GBP' },
  { label: 'JPY', value: 'JPY' },
] satisfies { label: string; value: CurrencyCode }[]

const tickModeOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Custom', value: 'custom' },
] satisfies { label: string; value: TickMode }[]

const DEFAULT_TICK_COUNT = 5

// ===== FUNCTIONS =============================================================
function AxisWidget({ orientation, value, onChange }: AxisWidgetProps) {
  const title = orientation === 'x' ? 'X Axis' : 'Y Axis'
  const AxisIcon = orientation === 'x' ? MoveHorizontal : MoveVertical
  const { labels, titleStyle } = value
  const tickMode: TickMode = labels.tickCount === null ? 'auto' : 'custom'
  return (
    <InspectorWidget
      title={title}
      icon={<AxisIcon size={16} />}
      visibility={{
        visible: value.enabled,
        onChange: (enabled) => {
          onChange({ ...value, enabled })
        },
      }}
    >
      <ControlRow label="Title">
        <TextInput
          label={`${title} title`}
          value={value.title}
          placeholder="Automatic"
          onValueChange={(axisTitle) => {
            onChange({
              ...value,
              title: axisTitle,
            })
          }}
        />
      </ControlRow>
      <ControlRow label="Title color">
        <ColorControl
          label={`${title} title color`}
          value={titleStyle.color}
          onChange={(color) => {
            onChange({
              ...value,
              titleStyle: { ...titleStyle, color },
            })
          }}
        />
      </ControlRow>
      <ControlRow label="Title size">
        <ScrubbableNumber
          label={`${title} title font size`}
          min={9}
          max={28}
          step={1}
          value={titleStyle.fontSize}
          onValueChange={(fontSize) => {
            onChange({
              ...value,
              titleStyle: { ...titleStyle, fontSize },
            })
          }}
        />
      </ControlRow>
      <ControlRow label="Title weight">
        <FontWeightControl
          label={`${title} title font weight`}
          value={titleStyle.fontWeight}
          onValueChange={(fontWeight) => {
            onChange({
              ...value,
              titleStyle: { ...titleStyle, fontWeight },
            })
          }}
        />
      </ControlRow>
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
        <div className="inspector-widget-subproperties">
          <ControlRow label="Currency">
            <SelectControl
              label={`${title} currency`}
              options={currencyOptions}
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
                tickCount: nextTickMode === 'auto' ? null : DEFAULT_TICK_COUNT,
              },
            })
          }}
        />
      </ControlRow>
      {labels.tickCount !== null ? (
        <div className="inspector-widget-subproperties">
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
    </InspectorWidget>
  )
}

export default AxisWidget
