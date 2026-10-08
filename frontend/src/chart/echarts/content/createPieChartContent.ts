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
  const { chartType, highlightResult, queryResult, selection, spec } = context
  const label = createSeriesLabelOption(spec.appearance.labels)
  const palette = spec.appearance.colorScale.categorical.palette
  const basePoints = queryResult?.points ?? []
  const points = selection ? (highlightResult?.points ?? []) : basePoints
  const categories = basePoints.map((point) => point.x ?? 'No category')
  const data: NonNullable<PieSeriesOption['data']> = points.flatMap((point) => {
    if (typeof point.value !== 'number') {
      return []
    }
    const name = point.x ?? 'No category'
    const colorIndex = Math.max(categories.indexOf(name), 0)
    return [
      {
        itemStyle: { color: palette[colorIndex % palette.length] },
        name,
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
