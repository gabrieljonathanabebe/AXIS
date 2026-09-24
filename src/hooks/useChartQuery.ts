import { useEffect, useState } from 'react'
import {
  fetchChartQuery,
  type ChartQueryRequest,
  type ChartQueryResult,
} from '../api/chartQuery'

type ChartQueryState = {
  result: ChartQueryResult | null
  isLoading: boolean
  error: string | null
}

export function useChartQuery(
  datasetId: string | null,
  query: ChartQueryRequest | null,
): ChartQueryState {
  const [state, setState] = useState<ChartQueryState>({
    result: null,
    isLoading: false,
    error: null,
  })
  const x = query?.x
  const y = query?.y
  const series = query?.series
  const aggregation = query?.aggregation
  const color = query?.color
  const colorAggregation = query?.color_aggregation

  useEffect(() => {
    if (!datasetId || !x || !y || !aggregation) {
      return
    }
    let active = true
    setState({ result: null, isLoading: true, error: null })

    fetchChartQuery(datasetId, {
      x,
      y,
      series: series ?? null,
      color: color ?? null,
      color_aggregation: colorAggregation ?? null,
      aggregation,
    })
      .then((result) => {
        if (active) {
          setState({ result, isLoading: false, error: null })
        }
      })
      .catch(() => {
        if (active) {
          setState({
            result: null,
            isLoading: false,
            error: 'Chart query failed.',
          })
        }
      })
    return () => {
      active = false
    }
  }, [datasetId, x, y, series, color, colorAggregation, aggregation])
  if (!datasetId || !query) {
    return { result: null, isLoading: false, error: null }
  }

  return state
}
