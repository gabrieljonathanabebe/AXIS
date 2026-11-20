import { isRadialChartType } from '@/charts/chartDefinitions'
import { getColorCss } from '@/shared/colorValue'
import { getSurfaceCssText } from '@/shared/surface'
import { FONT_WEIGHT_VALUES } from '@/shared/textStyle'
import { createTooltipFormatter } from './createTooltipFormatter'

import type { TooltipComponentOption } from 'echarts'
import type { ChartSpec, ChartType } from '@/charts/types'
import type { DataField } from '@/datasets/types'
import type { DataSelection } from '@/workspace/types'

// ===== TYPES =================================================================
type CreateTooltipOptionsParams = {
  chartType: ChartType
  fields: DataField[]
  isSelectionSource: boolean
  selection: DataSelection | null
  spec: ChartSpec
  valueLabel: string | undefined
}

// ===== FUNCTION ==============================================================
/**
 * Creates the tooltip of a chart from the spec: its content, and its look
 * as CSS of the shared building blocks, since ECharts renders the element.
 * The values take the color and weight of the text style; the labels fade
 * that color in the CSS of the chart.
 */
export function createTooltipOption({
  chartType,
  fields,
  isSelectionSource,
  selection,
  spec,
  valueLabel,
}: CreateTooltipOptionsParams): TooltipComponentOption {
  const { tooltip } = spec.interaction
  const { layout, surface, textStyle } = spec.appearance.tooltip
  const textColor = getColorCss(textStyle.color)
  return {
    appendTo: 'body',
    backgroundColor: 'transparent',
    borderWidth: 0,
    extraCssText: [
      `--chart-tooltip-gap: ${layout.gap}px`,
      `--chart-tooltip-text: ${textColor}`,
      `--chart-tooltip-value-weight: ${FONT_WEIGHT_VALUES[textStyle.fontWeight]}`,
      getSurfaceCssText(surface),
    ].join(';'),
    formatter: createTooltipFormatter({
      chartType,
      fields,
      isSelectionSource,
      selection,
      spec,
      valueLabel,
    }),
    padding: layout.padding,
    show: tooltip.enabled,
    showDelay: tooltip.delay,
    textStyle: {
      color: textColor,
      fontSize: textStyle.fontSize,
      fontStyle: textStyle.fontStyle,
    },
    trigger: isRadialChartType(chartType) ? 'item' : tooltip.trigger,
  }
}
