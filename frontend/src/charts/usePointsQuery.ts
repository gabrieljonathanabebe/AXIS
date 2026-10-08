import { useQuery } from '../shared/useQuery'
import { fetchPointsQuery } from './chartsApi'

import type { Query } from '../shared/useQuery'
import type { PointsQueryRequest, PointsQueryResult } from './chartsApi'

/** Loads the rows of a scatter chart; keeps the old points while new load. */
export function usePointsQuery(
  datasetId: string | null,
  query: PointsQueryRequest | null,
): Query<PointsQueryResult> {
  return useQuery({
    errorMessage: 'Points could not be loaded.',
    keepPreviousResult: true,
    load: (request) => fetchPointsQuery(request.datasetId, request.query),
    request: datasetId && query ? { datasetId, query } : null,
  })
}
