import type { Aggregation } from '../types/chart'
import { post } from './client'

export type ChartQueryRequest = {
  x: string
  y: string
  series: string | null
  aggregation: Exclude<Aggregation, 'none'>
}

export type ChartQueryPoint = {
  x: string | null
  series: string | null
  value: number | null
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
