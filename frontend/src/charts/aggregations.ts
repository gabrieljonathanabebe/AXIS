import type { Aggregation, GroupAggregation } from './types'

// ===== CONSTANTS =============================================================
/** Display name of each aggregation, shared by selects and titles. */
export const AGGREGATION_LABELS: Record<Aggregation, string> = {
  count: 'Count',
  max: 'Max',
  mean: 'Mean',
  median: 'Median',
  min: 'Min',
  none: 'None',
  sum: 'Sum',
}

/** Aggregations that combine a group, in the order selects list them. */
export const GROUP_AGGREGATIONS: GroupAggregation[] = [
  'sum',
  'mean',
  'median',
  'min',
  'max',
  'count',
]

// ===== FUNCTIONS =============================================================
/**
 * Turns aggregations into select options with their display names.
 * @param aggregations Aggregations to offer, in display order.
 * @returns One option per aggregation.
 */
export function getAggregationOptions<TAggregation extends Aggregation>(
  aggregations: TAggregation[],
): { label: string; value: TAggregation }[] {
  return aggregations.map((value) => ({
    label: AGGREGATION_LABELS[value],
    value,
  }))
}
