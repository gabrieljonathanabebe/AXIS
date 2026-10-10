import { hasAggregatedColor, isPointsChartType } from './chartDefinitions'

import type {
  ChartFilter,
  ChartQueryRequest,
  PointsQueryRequest,
} from './chartsApi'
import type { ChartInstance } from './types'
import type { DataSelection, SelectionFilter } from '../workspace/types'

function toChartFilter(filter: SelectionFilter): ChartFilter {
  if (filter.kind === 'range') {
    return filter
  }
  return {
    ...filter,
    values: filter.values.map((value) => String(value)),
  }
}

export function createChartQuery(
  chart: ChartInstance,
): ChartQueryRequest | null {
  const { aggregation, colorAggregation, encoding } = chart.spec.data
  if (
    isPointsChartType(chart.type) ||
    aggregation === 'none' ||
    !encoding.x ||
    !encoding.y
  ) {
    return null
  }
  const colorField = hasAggregatedColor(chart.type, encoding)
    ? (encoding.color ?? null)
    : null
  return {
    aggregation,
    color: colorField,
    color_aggregation: colorField ? colorAggregation : null,
    filters: [],
    series: encoding.series ?? null,
    x: encoding.x,
    y: encoding.y,
  }
}

// Scatter draws single rows; it asks only for its encoded fields.
export function createPointsQuery(
  chart: ChartInstance,
): PointsQueryRequest | null {
  const { color, size, x, y } = chart.spec.data.encoding
  if (!isPointsChartType(chart.type) || !x || !y) {
    return null
  }
  const fields = [x, y, size, color].filter((field): field is string => {
    return Boolean(field)
  })
  return { fields: [...new Set(fields)] }
}

export function createHighlightQuery(
  query: ChartQueryRequest | null,
  selection: DataSelection | null,
): ChartQueryRequest | null {
  if (!query || !selection) {
    return null
  }
  return {
    ...query,
    filters: selection.filters.map(toChartFilter),
  }
}
