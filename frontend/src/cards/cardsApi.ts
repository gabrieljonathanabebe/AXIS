import { postJson } from '../shared/api/client'

import type { ChartFilter } from '../charts/chartsApi'
import type { GroupAggregation } from '../charts/types'

export type CardQueryRequest = {
  aggregation: GroupAggregation
  field: string | null
  filters: ChartFilter[]
}

export type CardQueryResult = {
  value: number | null
}

/**
 * Loads the aggregated value of a card.
 * @param datasetId Dataset the card reads from.
 * @param query Field, aggregation and filters of the card.
 * @returns The value; null if no row has one.
 */
export function fetchCardQuery(
  datasetId: string,
  query: CardQueryRequest,
): Promise<CardQueryResult> {
  return postJson<CardQueryResult>(`/datasets/${datasetId}/card-query`, query)
}
