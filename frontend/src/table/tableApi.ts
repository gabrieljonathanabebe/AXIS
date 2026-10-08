import type { DataRow, ValueCount } from '../datasets/types'
import type { SortDirection } from './types'
import type { ChartFilter } from '../charts/chartsApi'
import { get, post } from '../shared/api/client'

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

export type FieldValues = {
  field: string
  total_count: number
  values: ValueCount[]
}

export function fetchFieldValues(
  datasetId: string,
  fieldName: string,
  search: string,
): Promise<FieldValues> {
  const field = encodeURIComponent(fieldName)
  return get<FieldValues>(`/datasets/${datasetId}/fields/${field}/values`, {
    search,
  })
}
