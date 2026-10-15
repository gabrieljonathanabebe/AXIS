import { GROUP_AGGREGATIONS } from '../charts/aggregations'

import type { GroupAggregation } from '../charts/types'
import type { DataField } from '../datasets/types'

/**
 * Lists the aggregations a card can apply to its field.
 * @param field Field on the card, or undefined when it counts rows.
 * @returns All aggregations for measures; any other field is only counted.
 */
export function getCardAggregations(
  field: DataField | undefined,
): GroupAggregation[] {
  return field?.semantic_role === 'measure' ? GROUP_AGGREGATIONS : ['count']
}
