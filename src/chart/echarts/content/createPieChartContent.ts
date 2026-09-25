import type { PieSeriesOption } from 'echarts'

import { isRadialChartType } from '../../isRadialChartType'
import { createSeriesLabelOption } from '../createSeriesLabelOption'

import type { ChartContent, ChartContentContext } from './chartContentTypes'

// ===== FUNCTION ==============================================================
export function createPieChartContent(
  context: ChartContentContext,
): ChartContent {
  if (!isRadialChartType(context.chartType)) {
    throw new Error(`Unsupported radial chart type: ${context.chartType}`)
  }

  // ===== CONSTANTS ===========================================================
  const { chartType, queryResult, spec } = context
  const label = createSeriesLabelOption(spec.appearance.labels)
  const data: NonNullable<PieSeriesOption['data']> = (
    queryResult?.points ?? []
  ).flatMap((point) => {
    if (typeof point.value !== 'number') {
      return []
    }

    return [
      {
        name: point.x ?? 'No category',
        value: point.value,
      },
    ]
  })

  const series: PieSeriesOption = {
    avoidLabelOverlap: true,
    data,
    label: {
      ...label,
      position:
        spec.appearance.labels.position === 'inside' ? 'inside' : 'outside',
    },
    radius: chartType === 'donut' ? ['42%', '68%'] : [0, '68%'],
    stillShowZeroSum: false,
    type: 'pie',
  }

  // ===== RETURN ==============================================================
  return {
    series: [series],
  }
}
