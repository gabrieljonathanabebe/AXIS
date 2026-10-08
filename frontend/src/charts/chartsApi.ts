import type { GroupAggregation } from './types'
import type { DataRow } from '../datasets/types'
import { post } from '../shared/api/client'

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
  return post<ChartQueryResult>(
    `/datasets/${datasetId}/chart-query`,
    JSON.stringify(query),
    { 'Content-Type': 'application/json' },
  )
}

export function fetchPointsQuery(
  datasetId: string,
  query: PointsQueryRequest,
): Promise<PointsQueryResult> {
  return post<PointsQueryResult>(
    `/datasets/${datasetId}/points-query`,
    JSON.stringify(query),
    { 'Content-Type': 'application/json' },
  )
}
