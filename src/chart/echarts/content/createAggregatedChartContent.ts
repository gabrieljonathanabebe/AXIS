import { getColorEncodingMode } from '../../getColorEncodingMode'
import { createAxesOptions } from '../createAxesOptions'
import { createContinuousColorVisualMap } from '../createContinuousColorVisualMap'
import {
  createAggregatedSeriesOption,
  type AggregatedSeriesData,
} from './createAggregatedSeriesOption'

import type { ChartContent, ChartContentContext } from './chartContentTypes'

export function createAggregatedChartContent(
  context: ChartContentContext,
): ChartContent {
  const { chartType, queryResult, spec, theme } = context

  if (chartType !== 'bar' && chartType !== 'line') {
    throw new Error(`Unsupported aggregated chart type: ${chartType}`)
  }

  const { appearance } = spec
  const { encoding } = spec.data
  const points = queryResult?.points ?? []
  const categories = Array.from(new Set(points.map((point) => point.x ?? '')))
  const colorEncodingMode = getColorEncodingMode(chartType, encoding)
  const hasBarColor = chartType === 'bar' && colorEncodingMode === 'continuous'
  const seriesNames = encoding.series
    ? Array.from(new Set(points.map((point) => point.series)))
    : [null]

  const series = seriesNames.map((name) => {
    const pointsByCategory = new Map(
      points
        .filter((point) => point.series === name)
        .map((point) => [point.x ?? '', point]),
    )

    const data = categories.map<AggregatedSeriesData[number]>((category) => {
      const point = pointsByCategory.get(category)

      if (!point) {
        return null
      }

      return hasBarColor
        ? [category, point.value, point.color_value]
        : point.value
    })

    return createAggregatedSeriesOption({
      appearance,
      chartType,
      colorEncodingMode,
      data,
      hasBarColor,
      name,
    })
  })

  const colorVisualMap = hasBarColor
    ? createContinuousColorVisualMap({
        appearance: appearance.colorScale.continuous,
        dimension: 2,
        values: points.map((point) => {
          return point.color_value
        }),
      })
    : null

  const { xAxis, yAxis } = createAxesOptions({
    appearance,
    categories,
    chartType,
    encoding,
    theme,
  })

  return {
    series,
    visualMap: colorVisualMap ? [colorVisualMap] : undefined,
    xAxis,
    yAxis,
  }
}
