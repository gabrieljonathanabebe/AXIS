import type { EChartsOption } from 'echarts'

import type { ChartQueryResult } from '../../api/chartQuery'
import type { ChartSpec, ChartType, Dataset } from '../../types/chart'
import { getColorEncodingMode } from '../getColorEncodingMode'
import type { ChartTheme } from './chartTheme'
import { createChartContent } from './content/createChartContent'
import { createDataZoomOption } from './createDataZoomOption'
import { createLegendOption } from './createLegendOption'
import { createTitleOption } from './createTitleOption'
import { createTooltipOption } from './createTooltipOption'

// ===== FUNCTION ==============================================================
export function createEChartOption(
  chartType: ChartType,
  spec: ChartSpec,
  dataset: Dataset,
  theme: ChartTheme,
  queryResult: ChartQueryResult | null,
): EChartsOption {
  // ===== CONSTANTS ===========================================================
  const { appearance, interaction } = spec
  const colorEncodingMode = getColorEncodingMode(spec.data.encoding)
  const content = createChartContent({
    chartType,
    dataset,
    queryResult,
    spec,
    theme,
  })

  // ===== RETURN ==============================================================
  return {
    animation: interaction.animation.enabled,
    animationDuration: interaction.animation.duration,
    animationEasing: interaction.animation.easing,
    backgroundColor: 'transparent',
    color:
      colorEncodingMode === 'categorical'
        ? appearance.colorScale.categorical.palette
        : [appearance.color],
    dataZoom: createDataZoomOption(interaction.zoom),
    grid: {
      bottom: 72,
      containLabel: false,
      left: 72,
      right: 56,
      top: 56,
    },
    legend: createLegendOption({
      appearance: appearance.legend,
      colorEncodingMode,
      interaction: interaction.legend,
    }),
    series: content.series,
    title: createTitleOption({
      appearance: appearance.title,
      chartType,
      encoding: spec.data.encoding,
      theme,
    }),
    tooltip: createTooltipOption({
      chartType,
      spec,
      theme,
    }),
    visualMap: content.visualMap,
    xAxis: content.xAxis,
    yAxis: content.yAxis,
  }
}
