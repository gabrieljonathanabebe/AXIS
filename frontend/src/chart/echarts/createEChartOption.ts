import type { EChartsOption } from 'echarts'

import type { ChartQueryResult } from '../../api/chartQuery'
import type { ChartSpec, ChartType } from '../../types/chart'
import type { DataRow, Dataset } from '../../datasets/types'
import { createBrushOption } from './createBrushOption'
import { getColorEncodingMode } from '../getColorEncodingMode'
import type { ChartTheme } from './chartTheme'
import type { DataSelection } from '../../types/workspace'
import { createChartContent } from './content/createChartContent'
import { createDataZoomOption } from './createDataZoomOption'
import { createLegendOption } from './createLegendOption'
import { createTooltipOption } from './createTooltipOption'
import { isRadialChartType } from '../isRadialChartType'

// ===== FUNCTION ==============================================================
export function createEChartOption(
  chartType: ChartType,
  spec: ChartSpec,
  dataset: Dataset,
  theme: ChartTheme,
  queryResult: ChartQueryResult | null,
  highlightResult: ChartQueryResult | null,
  points: DataRow[],
  selection: DataSelection | null,
  chartId: string,
): EChartsOption {
  // ===== CONSTANTS ===========================================================
  const { appearance, interaction } = spec
  const colorEncodingMode = getColorEncodingMode(
    chartType,
    spec.data.encoding,
    dataset.fields,
  )
  const isRadialChart = isRadialChartType(chartType)
  const isSelectionSource = selection?.sourceChartId === chartId
  const content = createChartContent({
    chartType,
    dataset,
    highlightResult,
    points,
    queryResult,
    selection,
    spec,
    theme,
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
