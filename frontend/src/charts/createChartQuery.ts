import { hasAggregatedColor, isPointsChartType } from './chartDefinitions'
import {
  getEffectiveAggregation,
  getValueField,
} from './getEffectiveAggregation'
import { getSelectionQueryFilters } from '../workspace/dataSelection'

import type { ChartQueryRequest, PointsQueryRequest } from './chartsApi'
import type { ChartInstance } from './types'
import type { DataField } from '../datasets/types'
import type { DataSelection } from '../workspace/types'

export function createChartQuery(
  chart: ChartInstance,
  fields: DataField[],
): ChartQueryRequest | null {
  const { colorAggregation, encoding } = chart.spec.data
  const aggregation = getEffectiveAggregation(chart.spec.data, fields)
  const valueField = getValueField(chart.spec.data)

  if (
    isPointsChartType(chart.type) ||
    aggregation === 'none' ||
    !encoding.x ||
    !valueField
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
    y: valueField,
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
    filters: getSelectionQueryFilters(selection),
  }
}
