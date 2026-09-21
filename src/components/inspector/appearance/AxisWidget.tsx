import { MoveHorizontal, MoveVertical } from 'lucide-react'

import ControlRow from '../../ui/ControlRow'
import SelectControl from '../../ui/SelectControl'
import TextInput from '../../ui/TextInput'
import InspectorWidget from '../InspectorWidget'

import type {
  AxisAppearance,
  AxisFormat,
  CurrencyCode,
} from '../../../types/chart'

type AxisOrientation = 'x' | 'y'

type AxisWidgetProps = {
  orientation: AxisOrientation
  value: AxisAppearance
  onChange: (value: AxisAppearance) => void
}

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

function AxisWidget({ orientation, value, onChange }: AxisWidgetProps) {
  const title = orientation === 'x' ? 'X Axis' : 'Y Axis'
  const AxisIcon = orientation === 'x' ? MoveHorizontal : MoveVertical
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
      ) : null}
    </InspectorWidget>
  )
}

export default AxisWidget
