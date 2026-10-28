import { getAggregationOptions } from '../charts/aggregations'
import ControlRow from '../shared/ui/ControlRow'
import FormatWidget from '../shared/ui/FormatWidget'
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
 * Groups of a card's value: how it is aggregated, how it looks and its
 * number format. Only one aggregation means the field can only be counted.
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
      <FormatWidget title="Function">
        <ControlRow>
          <SelectControl
            disabled={aggregations.length < 2}
            label="Value aggregation"
            options={getAggregationOptions(aggregations)}
            value={aggregation}
            onChange={onAggregationChange}
          />
        </ControlRow>
      </FormatWidget>
      <FormatWidget title="Text">
        <TextStyleControls
          defaultColor={CARD_VALUE_TEXT_STYLE.color}
          label="Value"
          maxFontSize={96}
          minFontSize={16}
          value={value.textStyle}
          onChange={(textStyle) => onChange({ ...value, textStyle })}
        />
      </FormatWidget>
      <FormatWidget title="Format">
        <NumberFormatControls
          label="Value"
          value={value.numberFormat}
          onChange={(numberFormat) => onChange({ ...value, numberFormat })}
        />
      </FormatWidget>
    </>
  )
}

export default CardValueWidget
