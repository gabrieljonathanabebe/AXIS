import type { ChartQueryRequest } from '../api/chartQuery'
import type { ChartInstance } from '../types/chart'
import type { DataSelection } from '../types/workspace'

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
  const colorField =
    chart.type === 'bar' ? (encoding.color?.name ?? null) : null
  return {
    aggregation,
    color: colorField,
    color_aggregation: colorField ? colorAggregation : null,
    filters: [],
    series: encoding.series?.name ?? null,
    x: encoding.x.name,
    y: encoding.y.name,
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
    filters: [
      {
        field: selection.field,
        values: selection.values.map((value) => String(value)),
      },
    ],
  }
}
