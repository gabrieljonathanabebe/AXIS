import { getSelectionQueryFilters } from '../workspace/dataSelection'
import { hasAggregatedColor, isPointsChartType } from './chartDefinitions'
import {
  getEffectiveAggregation,
  getValueField,
} from './getEffectiveAggregation'

import type { DataField } from '../datasets/types'
import type { DataSelection } from '../workspace/types'
import type { ChartQueryRequest, PointsQueryRequest } from './chartsApi'
import type { ChartInstance } from './types'

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

/**
 * Builds the rows query of a scatter chart: its encoded fields plus the
 * fields a selection filters on, so it can tell which points another
 * chart's selection contains.
 * @param chart Chart whose rows are loaded.
 * @param selection Active selection, or null when nothing is selected.
 * @returns Fields to load, or null for other chart types or without x or y.
 */
export function createPointsQuery(
  chart: ChartInstance,
  selection: DataSelection | null,
): PointsQueryRequest | null {
  const { color, size, x, y } = chart.spec.data.encoding
  if (!isPointsChartType(chart.type) || !x || !y) {
    return null
  }
  const selectionFields = selection?.filters.map((filter) => filter.field) ?? []
  const fields = [x, y, size, color, ...selectionFields].filter(
    (field): field is string => {
      return Boolean(field)
    },
  )
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
