import ControlRow from '../shared/ui/ControlRow'
import {
  CURRENCY_OPTIONS,
  VALUE_FORMAT_OPTIONS,
} from '../shared/format/valueFormats'
import { getAggregationOptions } from '../charts/aggregations'
import SelectControl from '../shared/ui/SelectControl'
import TextStyleControls from '../shared/ui/TextStyleControls'

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
      <TextStyleControls
        label="Value"
        maxFontSize={96}
        minFontSize={16}
        value={value.textStyle}
        onChange={(textStyle) => onChange({ ...value, textStyle })}
      />
    </>
  )
}

export default CardValueWidget
