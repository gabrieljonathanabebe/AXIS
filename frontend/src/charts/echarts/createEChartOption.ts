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
import type { ChartContentContext } from './content/chartContentTypes'

// ===== TYPES =================================================================
type EChartOptionContext = ChartContentContext & {
  animation: DashboardAnimation
  chartId: string
}

// ===== FUNCTION ==============================================================
/** Translates a chart and its query results into one ECharts option. */
export function createEChartOption(
  context: EChartOptionContext,
): EChartsOption {
  // ===== CONSTANTS ===========================================================
  const { animation, chartId, chartType, dataset, selection, spec, theme } =
    context
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
    theme,
  })

  // ===== RETURN ==============================================================
  return {
    animation: animation.enabled,
    animationDuration: animation.duration,
    animationEasing: animation.easing,
    backgroundColor: 'transparent',
    brush: createBrushOption(chartType, theme),

    color:
      colorEncodingMode === 'categorical'
        ? resolvePalette(appearance.colorScale.categorical.palette, theme)
        : [resolveColor(appearance.color, theme)],
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
