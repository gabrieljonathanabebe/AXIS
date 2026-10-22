import type { PieSeriesOption } from 'echarts'

import { isRadialChartType } from '../../chartDefinitions'
import { createSeriesLabelOption } from '../createSeriesLabelOption'
import type { LegendAppearance } from '../../types'
import type { ChartContent, ChartContentContext } from './chartContentTypes'

// ===== HELPERS ===============================================================
// Moves the pie away from a visible legend so the two never overlap.
function getPieCenter(legend: LegendAppearance): [string, string] {
  if (!legend.visible) {
    return ['50%', '50%']
  }
  const centers: Record<LegendAppearance['position'], [string, string]> = {
    bottom: ['50%', '44%'],
    left: ['60%', '50%'],
    right: ['40%', '50%'],
    top: ['50%', '56%'],
  }
  return centers[legend.position]
}

// ===== FUNCTION ==============================================================
export function createPieChartContent(
  context: ChartContentContext,
): ChartContent {
  if (!isRadialChartType(context.chartType)) {
    throw new Error(`Unsupported radial chart type: ${context.chartType}`)
  }

  // ===== CONSTANTS ===========================================================
  const { chartType, highlightResult, queryResult, selection, spec, theme } =
    context
  const label = createSeriesLabelOption(spec.appearance.labels, theme)
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
    center: getPieCenter(spec.appearance.legend),
    data,
    label: {
      ...label,
      formatter: '{d}%',
      position:
        spec.appearance.labels.position === 'inside' ? 'inside' : 'outside',
    },
    percentPrecision: 0,
    radius: chartType === 'donut' ? ['42%', '68%'] : [0, '68%'],
    stillShowZeroSum: false,
    type: 'pie',
  }

  // ===== RETURN ==============================================================
  return {
    series: [series],
  }
}
