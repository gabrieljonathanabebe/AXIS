import type { ChartQueryRequest } from '../api/chartQuery'
import type { ChartInstance } from '../types/chart'

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
    series: encoding.series?.name ?? null,
    x: encoding.x.name,
    y: encoding.y.name,
  }
}
