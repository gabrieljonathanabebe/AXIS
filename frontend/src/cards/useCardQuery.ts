import { useQuery } from '../shared/useQuery'
import { fetchCardQuery } from './cardsApi'

import type { ChartFilter } from '../charts/chartsApi'
import type { Query } from '../shared/useQuery'
import type { CardQueryResult } from './cardsApi'
import type { CardDataSpec } from './types'

/**
 * Loads the value of a card whenever its data spec or filters change.
 * Keeps the previous value while loading, so a new selection does not
 * blank the card.
 * @param datasetId Dataset the card reads from; null loads nothing.
 * @param data Field and aggregation of the card.
 * @param filters Filters of the value, e.g. from the selection.
 * @returns The query state with the aggregated value.
 */
export function useCardQuery(
  datasetId: string | null,
  data: CardDataSpec,
  filters: ChartFilter[],
): Query<CardQueryResult> {
  return useQuery({
    errorMessage: 'Card query failed.',
    keepPreviousResult: true,
    load: (request) => fetchCardQuery(request.datasetId, request.query),
    request: datasetId ? { datasetId, query: { ...data, filters } } : null,
  })
}
