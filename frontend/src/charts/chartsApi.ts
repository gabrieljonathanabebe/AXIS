import type { GroupAggregation } from './types'
import type { DataRow } from '../datasets/types'
import { postJson } from '../shared/api/client'

export type ChartFilter =
  | {
      kind: 'values'
      field: string
      values: string[]
    }
  | {
      kind: 'range'
      field: string
      min: number | null
      max: number | null
    }

export type ChartQueryRequest = {
  aggregation: GroupAggregation
  color: string | null
  color_aggregation: GroupAggregation | null
  series: string | null
  filters: ChartFilter[]
  x: string
  y: string
}

export type ChartQueryPoint = {
  color_value: number | null
  series: string | null
  value: number | null
  x: string | null
}

export type ChartQueryResult = {
  points: ChartQueryPoint[]
}

export type PointsQueryRequest = {
  fields: string[]
}

export type PointsQueryResult = {
  rows: DataRow[]
  total_count: number
}

export function fetchChartQuery(
  datasetId: string,
  query: ChartQueryRequest,
): Promise<ChartQueryResult> {
  return postJson<ChartQueryResult>(`/datasets/${datasetId}/chart-query`, query)
}

export function fetchPointsQuery(
  datasetId: string,
  query: PointsQueryRequest,
): Promise<PointsQueryResult> {
  return postJson<PointsQueryResult>(
    `/datasets/${datasetId}/points-query`,
    query,
  )
}
