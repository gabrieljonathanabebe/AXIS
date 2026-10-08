import type { DataRow } from '../types/chart'
import type { SortDirection } from '../types/ui'
import type { ChartFilter } from './chartQuery'
import { post } from './client'

// Table only; charts filter with ChartFilter. Dates are ISO strings.
export type TableFilter =
  | ChartFilter
  | {
      kind: 'date_range'
      field: string
      start: string | null
      end: string | null
    }

export type TableQueryRequest = {
  filters: TableFilter[]
  limit: number
  offset: number
  sort: TableQuerySort | null
}

export type TableQueryResult = {
  offset: number
  rows: DataRow[]
  total_count: number
}

export type TableQuerySort = {
  direction: SortDirection
  field: string
}

export function fetchTableQuery(
  datasetId: string,
  query: TableQueryRequest,
): Promise<TableQueryResult> {
  return post<TableQueryResult>(
    `/datasets/${datasetId}/table-query`,
    JSON.stringify(query),
    { 'Content-Type': 'application/json' },
  )
}
