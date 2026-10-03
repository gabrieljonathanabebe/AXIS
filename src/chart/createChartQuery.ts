import type { ChartFilter, ChartQueryRequest } from '../api/chartQuery'
import type { ChartInstance } from '../types/chart'
import type { DataSelection, SelectionFilter } from '../types/workspace'

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
    chart.type === 'scatter' ||
    aggregation === 'none' ||
    !encoding.x ||
    !encoding.y
  ) {
    return null
  }
  const colorField = chart.type === 'bar' ? (encoding.color ?? null) : null
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
