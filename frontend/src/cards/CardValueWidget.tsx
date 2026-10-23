import { getAggregationOptions } from '../charts/aggregations'
import ControlRow from '../shared/ui/ControlRow'
import NumberFormatControls from '../shared/ui/NumberFormatControls'
import SelectControl from '../shared/ui/SelectControl'
import TextStyleControls from '../shared/ui/TextStyleControls'
import { CARD_VALUE_TEXT_STYLE } from './createCardInstance'

import type { GroupAggregation } from '../charts/types'
import type { CardValueAppearance } from './types'

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
      <NumberFormatControls
        label="Value"
        value={value.numberFormat}
        onChange={(numberFormat) => onChange({ ...value, numberFormat })}
      />
      <TextStyleControls
        defaultColor={CARD_VALUE_TEXT_STYLE.color}
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
