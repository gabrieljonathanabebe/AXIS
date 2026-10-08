import { useEffect, useRef, useState } from 'react'

import { fetchTableQuery } from './tableApi'

import type { TableFilter, TableQueryResult } from './tableApi'
import type { DataRow } from '../datasets/types'
import type { TableSort } from './types'

// ===== TYPES =================================================================
type TableRowsState = {
  error: string | null
  queryKey: string | null
  rows: DataRow[]
  totalCount: number
}

export type TableRows = {
  error: string | null
  isLoading: boolean
  isLoadingMore: boolean
  rows: DataRow[]
  totalCount: number | null
  loadMore: () => void
}

// ===== CONSTANTS =============================================================
const PAGE_SIZE = 200

const emptyState: TableRowsState = {
  error: null,
  queryKey: null,
  rows: [],
  totalCount: 0,
}

// ===== HELPERS ===============================================================
function fetchRowsPage(
  datasetId: string,
  sort: TableSort | null,
  filters: TableFilter[],
  offset: number,
): Promise<TableQueryResult> {
  return fetchTableQuery(datasetId, {
    filters,
    limit: PAGE_SIZE,
    offset,
    sort: sort ? { direction: sort.direction, field: sort.fieldName } : null,
  })
}

// ===== HOOK ==================================================================
// `sort` and `filters` must keep their identity between renders (state).
// A new query restarts at the first page; pages of an old query are dropped.
export function useTableRows(
  datasetId: string | null,
  sort: TableSort | null,
  filters: TableFilter[],
): TableRows {
  const [state, setState] = useState<TableRowsState>(emptyState)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const isPageRequested = useRef(false)
  const queryKey = JSON.stringify({ datasetId, filters, sort })
  const isCurrent = state.queryKey === queryKey

  useEffect(() => {
    if (!datasetId) {
      return
    }
    let isActive = true
    fetchRowsPage(datasetId, sort, filters, 0)
      .then((result) => {
        if (isActive) {
          setState({
            error: null,
            queryKey,
            rows: result.rows,
            totalCount: result.total_count,
          })
        }
      })
      .catch(() => {
        if (isActive) {
          setState({
            ...emptyState,
            error: 'Rows could not be loaded.',
            queryKey,
          })
        }
      })
    return () => {
      isActive = false
    }
  }, [datasetId, filters, queryKey, sort])

  function loadMore(): void {
    const hasMore = state.rows.length < state.totalCount
    if (!datasetId || !isCurrent || !hasMore || state.error) {
      return
    }
    if (isPageRequested.current) {
      return
    }
    isPageRequested.current = true
    setIsLoadingMore(true)

    fetchRowsPage(datasetId, sort, filters, state.rows.length)
      .then((result) => {
        setState((current) => {
          if (current.queryKey !== queryKey) {
            return current
          }
          return { ...current, rows: [...current.rows, ...result.rows] }
        })
      })
      .catch(() => {
        setState((current) => {
          if (current.queryKey !== queryKey) {
            return current
          }
          return { ...current, error: 'More rows could not be loaded.' }
        })
      })
      .finally(() => {
        isPageRequested.current = false
        setIsLoadingMore(false)
      })
  }

  return {
    error: isCurrent ? state.error : null,
    isLoading: datasetId !== null && !isCurrent,
    isLoadingMore,
    rows: state.rows,
    totalCount: state.queryKey === null ? null : state.totalCount,
    loadMore,
  }
}
