import { getAggregationOptions } from '@/charts/aggregations'
import Group from '@/shared/ui/Group'
import NumberFormatControls from '@/shared/ui/NumberFormatControls'
import Row from '@/shared/ui/Row'
import SelectControl from '@/shared/ui/SelectControl'
import TextStyleControls from '@/shared/ui/TextStyleControls'

import type { GroupAggregation } from '@/charts/types'
import type { CardValueAppearance } from './types'

// ===== TYPES =================================================================
type CardValueElementProps = {
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
function CardValueElement({
  aggregation,
  aggregations,
  value,
  onAggregationChange,
  onChange,
}: CardValueElementProps) {
  return (
    <>
      <Group title="Function">
        <Row layout="wide">
          <SelectControl
            disabled={aggregations.length < 2}
            label="Value aggregation"
            options={getAggregationOptions(aggregations)}
            value={aggregation}
            onChange={onAggregationChange}
          />
        </Row>
      </Group>
      <Group title="Text">
        <TextStyleControls
          label="Value"
          maxFontSize={96}
          minFontSize={16}
          value={value.textStyle}
          onChange={(textStyle) => onChange({ ...value, textStyle })}
        />
      </Group>
      <Group title="Format">
        <NumberFormatControls
          label="Value"
          value={value.numberFormat}
          onChange={(numberFormat) => onChange({ ...value, numberFormat })}
        />
      </Group>
    </>
  )
}

export default CardValueElement
