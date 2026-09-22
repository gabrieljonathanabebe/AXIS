import type { ChartInstance } from '../types/chart'

export function isLegendRelevant(chart: ChartInstance): boolean {
  const { encoding } = chart.spec.data
  const hasSeries =
    chart.type === 'line' || chart.type === 'bar'
      ? Boolean(encoding.series)
      : false

  const hasCategoricalColor =
    chart.type === 'scatter' && encoding.color?.semantic_type === 'categorical'

  return hasSeries || hasCategoricalColor
}
