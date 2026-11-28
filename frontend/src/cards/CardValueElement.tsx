import { getAggregationOptions } from '@/charts/aggregations'
import SelectControl from '@/shared/ui/controls/SelectControl'
import Group from '@/shared/ui/groups/Group'
import NumberFormatGroup from '@/shared/ui/groups/NumberFormatGroup'
import TextGroup from '@/shared/ui/groups/TextGroup'
import Row from '@/shared/ui/rows/Row'

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
      <TextGroup
        label="Value"
        maxFontSize={96}
        minFontSize={16}
        value={value.textStyle}
        onChange={(textStyle) => onChange({ ...value, textStyle })}
      />
      <NumberFormatGroup
        label="Value"
        value={value.numberFormat}
        onChange={(numberFormat) => onChange({ ...value, numberFormat })}
      />
    </>
  )
}

export default CardValueElement
