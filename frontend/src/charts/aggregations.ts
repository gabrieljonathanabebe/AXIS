import { ArrowDownToLine, ArrowUpToLine, Ban, Hash, Sigma } from 'lucide-react'

import { XBar, XTilde } from './chartIcons'

import type { LucideIcon } from 'lucide-react'
import type { OptionItem } from '../shared/ui/OptionsMenu'
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

/** Icon of each aggregation, e.g. Σ for the sum, shown next to its name. */
const AGGREGATION_ICONS: Record<Aggregation, LucideIcon> = {
  count: Hash,
  max: ArrowUpToLine,
  mean: XBar,
  median: XTilde,
  min: ArrowDownToLine,
  none: Ban,
  sum: Sigma,
}

// ===== FUNCTIONS =============================================================
/**
 * Turns aggregations into select options with their icons and names.
 * @param aggregations Aggregations to offer, in display order.
 * @returns One option per aggregation.
 */
export function getAggregationOptions<TAggregation extends Aggregation>(
  aggregations: TAggregation[],
): OptionItem<TAggregation>[] {
  return aggregations.map((value) => ({
    icon: AGGREGATION_ICONS[value],
    label: AGGREGATION_LABELS[value],
    value,
  }))
}
