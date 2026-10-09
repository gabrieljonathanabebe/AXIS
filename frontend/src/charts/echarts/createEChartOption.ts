import type { EChartsOption } from 'echarts'

import { createBrushOption } from './createBrushOption'
import { getColorEncodingMode } from '../getColorEncodingMode'
import { createChartContent } from './content/createChartContent'
import type { ChartContentContext } from './content/chartContentTypes'
import { createDataZoomOption } from './createDataZoomOption'
import { createLegendOption } from './createLegendOption'
import { createTooltipOption } from './createTooltipOption'
import { isRadialChartType } from '../isRadialChartType'

// ===== TYPES =================================================================
type EChartOptionContext = ChartContentContext & {
  chartId: string
}

// ===== FUNCTION ==============================================================
/** Translates a chart and its query results into one ECharts option. */
export function createEChartOption(
  context: EChartOptionContext,
): EChartsOption {
  // ===== CONSTANTS ===========================================================
  const { chartId, chartType, dataset, selection, spec, theme } = context
  const { appearance, interaction } = spec
  const colorEncodingMode = getColorEncodingMode(
    chartType,
    spec.data.encoding,
    dataset.fields,
  )
  const isRadialChart = isRadialChartType(chartType)
  const isSelectionSource = selection?.sourceChartId === chartId
  const content = createChartContent(context)

  // ===== RETURN ==============================================================
  return {
    animation: interaction.animation.enabled,
    animationDuration: interaction.animation.duration,
    animationEasing: interaction.animation.easing,
    backgroundColor: 'transparent',
    brush: createBrushOption(chartType, theme),

    color:
      colorEncodingMode === 'categorical'
        ? appearance.colorScale.categorical.palette
        : [appearance.color],
    dataZoom: isRadialChart
      ? undefined
      : createDataZoomOption(interaction.zoom),
    grid: isRadialChart
      ? undefined
      : {
          bottom: 72,
          containLabel: false,
          left: 72,
          right: 56,
          top: 40,
        },
    legend: createLegendOption({
      appearance: appearance.legend,
      colorEncodingMode,
      interaction: interaction.legend,
    }),
    series: content.series,
    tooltip: createTooltipOption({
      chartType,
      isSelectionSource,
      selection,
      spec,
      theme,
    }),
    visualMap: content.visualMap,
    xAxis: content.xAxis,
    yAxis: content.yAxis,
  }
}
