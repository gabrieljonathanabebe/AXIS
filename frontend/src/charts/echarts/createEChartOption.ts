import type { EChartsOption } from 'echarts'

import { createBrushOption } from './createBrushOption'
import { getColorEncodingMode } from '../getColorEncodingMode'
import { getValueLabel } from '../getEffectiveAggregation'
import { createChartContent } from './content/createChartContent'
import type { ChartContentContext } from './content/chartContentTypes'
import type { ChartTheme } from './chartTheme'
import { createDataZoomOption } from './createDataZoomOption'
import { createGridOption } from './createGridOption'
import { createLegendOption } from './createLegendOption'
import { createTooltipOption } from './createTooltipOption'
import { isRadialChartType } from '../chartDefinitions'

// ===== TYPES =================================================================
type EChartOptionContext = ChartContentContext & {
  chartId: string
  theme: ChartTheme
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
  const legend = createLegendOption({
    appearance: appearance.legend,
    colorEncodingMode,
    interaction: interaction.legend,
  })

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
      : createGridOption({
          legend: appearance.legend,
          series: content.series,
          showsLegend: legend.show === true,
        }),
    legend,
    series: content.series,
    tooltip: createTooltipOption({
      chartType,
      isSelectionSource,
      selection,
      spec,
      theme,
      valueLabel: getValueLabel(spec.data, dataset.fields),
    }),
    visualMap: content.visualMap,
    xAxis: content.xAxis,
    yAxis: content.yAxis,
  }
}
