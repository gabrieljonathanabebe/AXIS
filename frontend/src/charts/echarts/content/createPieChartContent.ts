import { isRadialChartType } from '../../chartDefinitions'
import { createEffectOption } from '../createEffectOption'
import { createFillOption } from '../createFillOption'
import { createSeriesLabelOption } from '../createSeriesLabelOption'
import { createBorderOption } from '../createStrokeStyleOption'
import { getPaletteColor, resolvePalette } from '../resolveColor'

import type { PieSeriesOption } from 'echarts'
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
/**
 * Builds the single series of a pie or donut chart. Every segment takes its
 * palette color and glows in it; fill opacity and border apply to all.
 * @param context Spec, theme, query results and selection of the chart.
 * @returns Pie series; radial charts have no axes.
 */
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
  const { pie } = spec.appearance
  const palette = resolvePalette(
    spec.appearance.colorScale.categorical.palette,
    theme,
  )
  const basePoints = queryResult?.points ?? []
  const points = selection ? (highlightResult?.points ?? []) : basePoints
  const categories = basePoints.map((point) => point.x ?? 'No category')
  const data: NonNullable<PieSeriesOption['data']> = points.flatMap((point) => {
    if (typeof point.value !== 'number') {
      return []
    }
    const name = point.x ?? 'No category'
    const colorIndex = Math.max(categories.indexOf(name), 0)
    const color = getPaletteColor(palette, colorIndex)
    return [
      {
        itemStyle: { ...createEffectOption(pie.effect, color), color },
        name,
        value: point.value,
      },
    ]
  })

  const series: PieSeriesOption = {
    avoidLabelOverlap: true,
    center: getPieCenter(spec.appearance.legend),
    data,
    itemStyle: {
      ...createFillOption(pie.fill, theme),
      ...createBorderOption(pie.border, theme),
    },
    label: {
      ...label,
      formatter: '{d}%',
      position:
        spec.appearance.labels.position === 'inside' ? 'inside' : 'outside',
    },
    percentPrecision: 0,
    radius: chartType === 'donut' ? [`${pie.innerRadius}%`, '68%'] : [0, '68%'],
    stillShowZeroSum: false,
    type: 'pie',
  }

  // ===== RETURN ==============================================================
  return {
    series: [series],
  }
}
