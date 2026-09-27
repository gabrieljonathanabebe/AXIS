import type { GroupAggregation } from '../types/chart'
import { post } from './client'

export type ChartFilter = {
  field: string
  values: string[]
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
