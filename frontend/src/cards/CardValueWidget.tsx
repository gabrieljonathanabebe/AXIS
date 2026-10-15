import ColorControl from '../shared/ui/ColorControl'
import ControlRow from '../shared/ui/ControlRow'
import FontWeightControl from '../shared/ui/FontWeightControl'
import ScrubbableNumber from '../shared/ui/ScrubbableNumber'
import SelectControl from '../shared/ui/SelectControl'
import { getAggregationOptions } from '../charts/aggregations'
import {
  CURRENCY_OPTIONS,
  VALUE_FORMAT_OPTIONS,
} from '../shared/format/valueFormats'

import type { CardValueAppearance } from './types'
import type { GroupAggregation } from '../charts/types'

// ===== TYPES =================================================================
type CardValueWidgetProps = {
  aggregation: GroupAggregation
  aggregations: GroupAggregation[]
  value: CardValueAppearance
  onAggregationChange: (aggregation: GroupAggregation) => void
  onChange: (value: CardValueAppearance) => void
}

// ===== COMPONENT =============================================================
/**
 * Controls of a card's value: how it is aggregated, its number format and
 * how it looks. Only one aggregation means the field can only be counted.
 */
function CardValueWidget({
  aggregation,
  aggregations,
  value,
  onAggregationChange,
  onChange,
}: CardValueWidgetProps) {
  return (
    <>
      <ControlRow label="Function">
        <SelectControl
          disabled={aggregations.length < 2}
          label="Value aggregation"
          options={getAggregationOptions(aggregations)}
          value={aggregation}
          onChange={onAggregationChange}
        />
      </ControlRow>
      <ControlRow label="Format">
        <SelectControl
          label="Value format"
          options={VALUE_FORMAT_OPTIONS}
          value={value.format}
          onChange={(format) => onChange({ ...value, format })}
        />
      </ControlRow>
      {value.format === 'currency' ? (
        <ControlRow label="Currency">
          <SelectControl
            label="Value currency"
            options={CURRENCY_OPTIONS}
            value={value.currency}
            onChange={(currency) => onChange({ ...value, currency })}
          />
        </ControlRow>
      ) : null}
      <ControlRow label="Color">
        <ColorControl
          label="Value color"
          value={value.color}
          onChange={(color) => onChange({ ...value, color })}
        />
      </ControlRow>
      <ControlRow label="Font size">
        <ScrubbableNumber
          label="Value font size"
          max={96}
          min={16}
          step={1}
          value={value.fontSize}
          onValueChange={(fontSize) => onChange({ ...value, fontSize })}
        />
      </ControlRow>
      <ControlRow label="Weight">
        <FontWeightControl
          label="Value font weight"
          value={value.fontWeight}
          onValueChange={(fontWeight) => onChange({ ...value, fontWeight })}
        />
      </ControlRow>
    </>
  )
}

export default CardValueWidget
