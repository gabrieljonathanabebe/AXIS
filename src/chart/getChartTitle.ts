import type { ChartInstance } from '../types/chart'

export function getDefaultChartTitle(chart: ChartInstance): string {
  const { x, y } = chart.spec.data.encoding
  if (!x && !y) {
    return 'Untitled Chart'
  }
  const xLabel = x?.name ?? 'Category'
  const yLabel = y?.name ?? 'Value'
  return chart.type === 'scatter'
    ? `${yLabel} vs. ${xLabel}`
    : `${yLabel} by ${xLabel}`
}

export function getChartTitle(chart: ChartInstance): string {
  return chart.spec.appearance.title.text.trim() || getDefaultChartTitle(chart)
}
