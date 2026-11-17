import { isRadialChartType } from '../chartDefinitions'
import { getColorEncodingMode } from '../getColorEncodingMode'
import { getValueLabel } from '../getEffectiveAggregation'
import { createChartContent } from './content/createChartContent'
import { createBrushOption } from './createBrushOption'
import { createDataZoomOption } from './createDataZoomOption'
import { createGridOption } from './createGridOption'
import { createLegendOption } from './createLegendOption'
import { createTooltipOption } from './createTooltipOption'
import { resolveColor, resolvePalette } from './resolveColor'

import type { EChartsOption } from 'echarts'
import type { DashboardAnimation } from '../../workspace/types'
import type { LegendEntry } from '../types'
import type { ChartContentContext } from './content/chartContentTypes'

// ===== TYPES =================================================================
type EChartOptionContext = ChartContentContext & {
  animation: DashboardAnimation
  chartId: string
  hiddenLegendNames: ReadonlySet<string>
}

/**
 * What a chart draws: the ECharts option for the canvas and the entries of
 * its HTML legend.
 */
export type EChartRender = {
  legend: LegendEntry[]
  option: EChartsOption
}

// ===== FUNCTION ==============================================================
/**
 * Translates a chart and its query results into one ECharts option and
 * the entries of its legend, which the chart shows as HTML.
 * @param context Chart, query results, selection, theme and animation.
 * @returns The option and the legend entries.
 */
export function createEChartOption(context: EChartOptionContext): EChartRender {
  // ===== CONSTANTS ===========================================================
  const {
    animation,
    chartId,
    chartType,
    dataset,
    hiddenLegendNames,
    selection,
    spec,
    theme,
  } = context
  const { appearance, interaction } = spec
  const colorEncodingMode = getColorEncodingMode(
    chartType,
    spec.data.encoding,
    dataset.fields,
  )
  const isRadialChart = isRadialChartType(chartType)
  const isSelectionSource = selection?.sourceChartId === chartId
  const content = createChartContent(context)

  // ===== OPTION ==============================================================
  const option: EChartsOption = {
    animation: animation.enabled,
    animationDuration: animation.duration,
    animationEasing: animation.easing,
    backgroundColor: 'transparent',
    brush: createBrushOption(chartType, theme),

    color:
      colorEncodingMode === 'categorical'
        ? resolvePalette(appearance.colorScale.categorical.palette)
        : [resolveColor(appearance.color)],
    dataZoom: isRadialChart
      ? undefined
      : createDataZoomOption(interaction.zoom),
    grid: isRadialChart ? undefined : createGridOption(),
    legend: createLegendOption(hiddenLegendNames),
    series: content.series,
    tooltip: createTooltipOption({
      chartType,
      isSelectionSource,
      selection,
      spec,
      valueLabel: getValueLabel(spec.data, dataset.fields),
    }),
    visualMap: content.visualMap,
    xAxis: content.xAxis,
    yAxis: content.yAxis,
  }

  // ===== RETURN ==============================================================
  return { legend: content.legend, option }
}
