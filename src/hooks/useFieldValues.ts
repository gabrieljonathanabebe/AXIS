import { useEffect, useState } from 'react'

import { fetchFieldValues } from '../api/datasets'

import type { FieldValues } from '../api/datasets'

// ===== TYPES =================================================================
type FieldValuesState = {
  error: string | null
  queryKey: string | null
  result: FieldValues | null
}

export type FieldValuesQuery = {
  error: string | null
  isLoading: boolean
  result: FieldValues | null
}

// ===== HOOK ==================================================================
// Keeps the previous result while a new search loads.
export function useFieldValues(
  datasetId: string | null,
  fieldName: string,
  search: string,
): FieldValuesQuery {
  const [state, setState] = useState<FieldValuesState>({
    error: null,
    queryKey: null,
    result: null,
  })
  const queryKey = JSON.stringify({ datasetId, fieldName, search })
  const isCurrent = state.queryKey === queryKey

  useEffect(() => {
    if (!datasetId) {
      return
    }
    let isActive = true
    fetchFieldValues(datasetId, fieldName, search)
      .then((result) => {
        if (isActive) {
          setState({ error: null, queryKey, result })
        }
      })
      .catch(() => {
        if (isActive) {
          setState({
            error: 'Values could not be loaded.',
            queryKey,
            result: null,
          })
        }
      })
    return () => {
      isActive = false
    }
  }, [datasetId, fieldName, queryKey, search])

  return {
    error: isCurrent ? state.error : null,
    isLoading: datasetId !== null && !isCurrent,
    result: state.result,
  }
}
