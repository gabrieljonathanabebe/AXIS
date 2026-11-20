import { getSelectionQueryFilters } from '@/workspace/dataSelection'
import { hasAggregatedColor, isPointsChartType } from './chartDefinitions'
import {
  getEffectiveAggregation,
  getValueField,
} from './getEffectiveAggregation'
import { getEffectiveCategoryOrder } from './getEffectiveCategoryOrder'
import { getEffectiveTimeGrain } from './getEffectiveTimeGrain'

import type { DataField } from '@/datasets/types'
import type { DataSelection } from '@/workspace/types'
import type {
  ChartQueryRequest,
  ChartQueryResult,
  PointsQueryRequest,
} from './chartsApi'
import type { ChartInstance } from './types'

/**
 * Builds the aggregated query of a bar, line, pie or donut chart.
 * @param chart Chart whose groups are loaded.
 * @param fields Dataset fields; decide aggregation, time grain and whether
 *   X is sorted and limited as categories.
 * @returns The query, or null for scatter charts and without x or value.
 */
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
  const categoryOrder = getEffectiveCategoryOrder(chart.spec.data, fields)
  return {
    aggregation,
    categories: null,
    color: colorField,
    color_aggregation: colorField ? colorAggregation : null,
    filters: [],
    limit: categoryOrder?.limit ?? null,
    series: encoding.series ?? null,
    sort: categoryOrder?.sort ?? null,
    time_grain: getEffectiveTimeGrain(chart.spec.data, fields),
    x: encoding.x,
    y: valueField,
  }
}

/**
 * Builds the rows query of a scatter chart: its encoded fields, every field
 * that is not a measure and the fields a selection filters on. Other charts
 * select on categories, so their selections need no new request.
 * @param chart Chart whose rows are loaded.
 * @param fields Dataset fields; all but measures are loaded up front.
 * @param selection Active selection, or null when nothing is selected.
 * @returns Fields to load, or null for other chart types or without x or y.
 */
export function createPointsQuery(
  chart: ChartInstance,
  fields: DataField[],
  selection: DataSelection | null,
): PointsQueryRequest | null {
  const { color, size, x, y } = chart.spec.data.encoding
  if (!isPointsChartType(chart.type) || !x || !y) {
    return null
  }
  const categoryFields = fields
    .filter((field) => field.semantic_role !== 'measure')
    .map((field) => field.name)
  const selectionFields = selection?.filters.map((filter) => filter.field) ?? []
  const names = [
    x,
    y,
    size,
    color,
    ...categoryFields,
    ...selectionFields,
  ].filter((name): name is string => {
    return Boolean(name)
  })
  return { fields: [...new Set(names)] }
}

/**
 * Reads the categories of a chart result.
 * @param result Result of the base query.
 * @returns X values in the order of the result, each once also with series.
 */
function getResultCategories(result: ChartQueryResult): (string | null)[] {
  return [...new Set(result.points.map((point) => point.x))]
}

/**
 * Builds the highlight query of a chart: the base query filtered by the
 * selection. A categorical X, which the base query sorts, takes the
 * categories of the base result instead of its own sort and limit, so the
 * highlight shows the same categories in the same order.
 * @param query Base query of the chart, or null without one.
 * @param selection Active selection, or null when nothing is selected.
 * @param result Result of the base query, or null while it loads.
 * @returns The highlight query; null without query or selection, and for a
 *   categorical X while the base result loads.
 */
export function createHighlightQuery(
  query: ChartQueryRequest | null,
  selection: DataSelection | null,
  result: ChartQueryResult | null,
): ChartQueryRequest | null {
  if (!query || !selection) {
    return null
  }
  const filters = getSelectionQueryFilters(selection)
  if (query.sort === null) {
    return { ...query, filters }
  }
  if (!result) {
    return null
  }
  return {
    ...query,
    categories: getResultCategories(result),
    filters,
    limit: null,
    sort: null,
  }
}
