import { getAggregatedLabel } from '../charts/getEffectiveAggregation'

import type { CardDataSpec, CardInstance } from './types'

/**
 * Names a card after what it aggregates, like a chart's value axis.
 * @param data Field and aggregation of the card.
 * @returns E.g. "Count of country", or "Count of rows" without a field.
 */
export function getDefaultCardTitle({
  aggregation,
  field,
}: CardDataSpec): string {
  return getAggregatedLabel(field ?? 'rows', aggregation)
}

/**
 * Returns the title a card shows.
 * @param card Card whose title is shown.
 * @returns The typed title, or the default title while it is empty.
 */
export function getCardTitle(card: CardInstance): string {
  return (
    card.spec.appearance.title.text.trim() ||
    getDefaultCardTitle(card.spec.data)
  )
}
