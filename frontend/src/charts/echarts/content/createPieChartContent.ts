import { isRadialChartType } from '@/charts/chartDefinitions'
import { createAxisDateFormatter } from '@/charts/echarts/createAxisLabelFormatter'
import { createEffectOption } from '@/charts/echarts/createEffectOption'
import { createFillOption } from '@/charts/echarts/createFillOption'
import { createSeriesPaintColor } from '@/charts/echarts/createPaintColor'
import { createSeriesLabelOption } from '@/charts/echarts/createSeriesLabelOption'
import { createBorderOption } from '@/charts/echarts/createStrokeStyleOption'
import { getPaletteColor, resolvePalette } from '@/charts/echarts/resolveColor'
import { getEffectiveTimeGrain } from '@/charts/getEffectiveTimeGrain'

import type { PieSeriesOption } from 'echarts'
import type { ChartContent, ChartContentContext } from './chartContentTypes'

// ===== FUNCTION ==============================================================
/**
 * Builds the single series of a pie or donut chart. Every segment takes its
 * palette color and glows in it; fill opacity and border apply to all.
 * @param context Spec, query results and selection of the chart.
 * @returns Pie series; radial charts have no axes.
 */
export function createPieChartContent(
  context: ChartContentContext,
): ChartContent {
  if (!isRadialChartType(context.chartType)) {
    throw new Error(`Unsupported radial chart type: ${context.chartType}`)
  }

  // ===== CONSTANTS ===========================================================
  const { chartType, dataset, highlightResult, queryResult, selection, spec } =
    context
  const label = createSeriesLabelOption(spec.appearance.labels)
  const { pie } = spec.appearance
  const palette = resolvePalette(spec.appearance.colorScale.categorical.palette)
  const basePoints = queryResult?.points ?? []
  const points = selection ? (highlightResult?.points ?? []) : basePoints
  const categories = basePoints.map((point) => point.x ?? 'No category')
  const formatCategory = createAxisDateFormatter(
    spec.appearance.xAxis,
    dataset.fields.find((field) => field.name === spec.data.encoding.x),
    getEffectiveTimeGrain(spec.data, dataset.fields),
  )
  const data: NonNullable<PieSeriesOption['data']> = points.flatMap((point) => {
    if (typeof point.value !== 'number') {
      return []
    }
    const name = point.x ?? 'No category'
    const colorIndex = Math.max(categories.indexOf(name), 0)
    const color = getPaletteColor(palette, colorIndex)
    return [
      {
        itemStyle: {
          ...createEffectOption(pie.effect, color),
          color: createSeriesPaintColor(pie.fill.paint, color),
        },
        name,
        value: point.value,
      },
    ]
  })

  const series: PieSeriesOption = {
    avoidLabelOverlap: true,
    data,
    itemStyle: {
      ...createFillOption(pie.fill),
      ...createBorderOption(pie.border),
    },
    label: {
      ...label,
      formatter: '{d}%',
      position:
        spec.appearance.labels.layout.position === 'inside'
          ? 'inside'
          : 'outside',
    },
    percentPrecision: 0,
    radius: chartType === 'donut' ? [`${pie.innerRadius}%`, '68%'] : [0, '68%'],
    stillShowZeroSum: false,
    type: 'pie',
  }

  // ===== RETURN ==============================================================
  return {
    legend: categories.map((name, index) => {
      return {
        color: getPaletteColor(palette, index),
        label: formatCategory?.(name),
        name,
      }
    }),
    series: [series],
  }
}
