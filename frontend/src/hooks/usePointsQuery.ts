import { useEffect, useState } from 'react'

import { fetchPointsQuery } from '../api/chartQuery'

import type { PointsQueryRequest, PointsQueryResult } from '../api/chartQuery'

// ===== TYPES =================================================================
type PointsQueryState = {
  error: string | null
  queryKey: string | null
  result: PointsQueryResult | null
}

export type PointsQuery = {
  error: string | null
  isLoading: boolean
  result: PointsQueryResult | null
}

// ===== HOOK ==================================================================
// Keeps the previous points while a new encoding loads.
export function usePointsQuery(
  datasetId: string | null,
  query: PointsQueryRequest | null,
): PointsQuery {
  const [state, setState] = useState<PointsQueryState>({
    error: null,
    queryKey: null,
    result: null,
  })
  const fieldsKey = query ? JSON.stringify(query.fields) : null
  const queryKey = JSON.stringify({ datasetId, fieldsKey })
  const isActiveQuery = datasetId !== null && fieldsKey !== null
  const isCurrent = state.queryKey === queryKey

  useEffect(() => {
    if (!datasetId || !fieldsKey) {
      return
    }
    let isActive = true
    fetchPointsQuery(datasetId, { fields: JSON.parse(fieldsKey) as string[] })
      .then((result) => {
        if (isActive) {
          setState({ error: null, queryKey, result })
        }
      })
      .catch(() => {
        if (isActive) {
          setState({
            error: 'Points could not be loaded.',
            queryKey,
            result: null,
          })
        }
      })
    return () => {
      isActive = false
    }
  }, [datasetId, fieldsKey, queryKey])

  if (!isActiveQuery) {
    return { error: null, isLoading: false, result: null }
  }
  return {
    error: isCurrent ? state.error : null,
    isLoading: !isCurrent,
    result: state.result,
  }
}
