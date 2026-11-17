import { getColorCss } from '../../shared/colorValue'
import { getSurfaceCssText } from '../../shared/surface'
import { FONT_WEIGHT_VALUES } from '../../shared/textStyle'
import { isRadialChartType } from '../chartDefinitions'
import { createTooltipFormatter } from './createTooltipFormatter'

import type { TooltipComponentOption } from 'echarts'
import type { DataSelection } from '../../workspace/types'
import type { ChartSpec, ChartType } from '../types'

// ===== TYPES =================================================================
type CreateTooltipOptionsParams = {
  chartType: ChartType
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
  isSelectionSource,
  selection,
  spec,
  valueLabel,
}: CreateTooltipOptionsParams): TooltipComponentOption {
  const { tooltip } = spec.interaction
  const { surface, textStyle } = spec.appearance.tooltip
  const textColor = getColorCss(textStyle.color)
  return {
    appendTo: 'body',
    backgroundColor: 'transparent',
    borderWidth: 0,
    extraCssText: [
      `--chart-tooltip-text: ${textColor}`,
      `--chart-tooltip-value-weight: ${FONT_WEIGHT_VALUES[textStyle.fontWeight]}`,
      getSurfaceCssText(surface),
    ].join(';'),
    formatter: createTooltipFormatter({
      chartType,
      isSelectionSource,
      selection,
      spec,
      valueLabel,
    }),
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
