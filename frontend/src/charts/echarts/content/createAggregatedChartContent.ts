import type { ChartQueryPoint } from '../../chartsApi'
import { createAxesOptions } from '../createAxesOptions'
import { createContinuousColorVisualMap } from '../createContinuousColorVisualMap'
import {
  createAggregatedSeriesOption,
  type AggregatedSeriesData,
} from './createAggregatedSeriesOption'
import { getColorEncodingMode } from '../../getColorEncodingMode'
import { DIMMED_OPACITY } from './selectionStyle'

import type { ChartContent, ChartContentContext } from './chartContentTypes'

// ===== HELPERS ===============================================================
function createSeriesData(
  points: ChartQueryPoint[],
  categories: string[],
  name: string | null,
  hasBarColor: boolean,
): AggregatedSeriesData {
  const pointsByCategory = new Map(
    points
      .filter((point) => point.series === name)
      .map((point) => [point.x ?? '', point]),
  )
  return categories.map((category) => {
    const point = pointsByCategory.get(category)
    if (!point) {
      return null
    }
    return hasBarColor
      ? [category, point.value, point.color_value]
      : point.value
  })
}

// ===== FUNCTION ==============================================================
export function createAggregatedChartContent(
  context: ChartContentContext,
): ChartContent {
  const {
    chartType,
    dataset,
    highlightResult,
    queryResult,
    selection,
    spec,
    theme,
  } = context

  if (chartType !== 'bar' && chartType !== 'line') {
    throw new Error(`Unsupported aggregated chart type: ${chartType}`)
  }

  const { appearance } = spec
  const { encoding } = spec.data
  const points = queryResult?.points ?? []
  const highlightPoints = selection ? (highlightResult?.points ?? []) : null
  const categories = Array.from(new Set(points.map((point) => point.x ?? '')))
  const colorEncodingMode = getColorEncodingMode(
    chartType,
    encoding,
    dataset.fields,
  )
  const hasBarColor = chartType === 'bar' && colorEncodingMode === 'continuous'
  const palette = appearance.colorScale.categorical.palette
  const seriesNames = encoding.series
    ? Array.from(new Set(points.map((point) => point.series)))
    : [null]

  function getSeriesColor(index: number): string | undefined {
    if (colorEncodingMode === 'constant') {
      return appearance.color
    }
    if (colorEncodingMode === 'categorical') {
      return palette[index % palette.length]
    }
    return undefined
  }

  const baseSeries = seriesNames.map((name, index) => {
    return createAggregatedSeriesOption({
      appearance,
      chartType,
      color: getSeriesColor(index),
      data: createSeriesData(points, categories, name, hasBarColor),
      hasBarColor,
      isHighlight: false,
      name,
      opacity: highlightPoints ? DIMMED_OPACITY : undefined,
      xAxisIndex: 0,
    })
  })

  const highlightSeries = highlightPoints
    ? seriesNames.map((name, index) => {
        return createAggregatedSeriesOption({
          appearance,
          chartType,
          color: getSeriesColor(index),
          data: createSeriesData(
            highlightPoints,
            categories,
            name,
            hasBarColor,
          ),
          hasBarColor,
          isHighlight: true,
          name,
          opacity: undefined,
          xAxisIndex: 1,
        })
      })
    : []

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
    series: [...baseSeries, ...highlightSeries],
    visualMap: colorVisualMap ? [colorVisualMap] : undefined,
    xAxis: highlightPoints
      ? [xAxis, { data: categories, show: false, type: 'category' }]
      : xAxis,
    yAxis,
  }
}
