import { useQuery } from '../shared/useQuery'
import { fetchCardQuery } from './cardsApi'

import type { CardQueryResult } from './cardsApi'
import type { CardDataSpec } from './types'
import type { Query } from '../shared/useQuery'

/**
 * Loads the value of a card whenever its data spec changes.
 * @param datasetId Dataset the card reads from; null loads nothing.
 * @param data Field and aggregation of the card.
 * @returns The query state with the aggregated value.
 */
export function useCardQuery(
  datasetId: string | null,
  data: CardDataSpec,
): Query<CardQueryResult> {
  return useQuery({
    errorMessage: 'Card query failed.',
    load: (request) => fetchCardQuery(request.datasetId, request.query),
    request: datasetId ? { datasetId, query: { ...data, filters: [] } } : null,
  })
}
