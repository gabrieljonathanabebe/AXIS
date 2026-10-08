import { useQuery } from '../shared/useQuery'
import { fetchChartQuery } from './chartsApi'

import type { Query } from '../shared/useQuery'
import type { ChartQueryRequest, ChartQueryResult } from './chartsApi'

/** Loads the aggregated points of a chart; shows nothing while new load. */
export function useChartQuery(
  datasetId: string | null,
  query: ChartQueryRequest | null,
): Query<ChartQueryResult> {
  return useQuery({
    errorMessage: 'Chart query failed.',
    load: (request) => fetchChartQuery(request.datasetId, request.query),
    request: datasetId && query ? { datasetId, query } : null,
  })
}
