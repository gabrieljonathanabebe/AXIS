import type { TooltipComponentOption } from 'echarts'

import type { ChartSpec, ChartType } from '../types'
import type { ChartTheme } from './chartTheme'
import { createTooltipFormatter } from './createTooltipFormatter'
import type { DataSelection } from '../../workspace/types'
import { isRadialChartType } from '../isRadialChartType'

// ===== TYPES =================================================================
type CreateTooltipOptionsParams = {
  chartType: ChartType
  isSelectionSource: boolean
  selection: DataSelection | null
  spec: ChartSpec
  theme: ChartTheme
}

// ===== FUNCTION ==============================================================
export function createTooltipOption({
  chartType,
  isSelectionSource,
  selection,
  spec,
  theme,
}: CreateTooltipOptionsParams): TooltipComponentOption {
  const { tooltip } = spec.interaction
  return {
    appendTo: 'body',
    backgroundColor: theme.tooltip.background,
    borderColor: theme.tooltip.borderColor,
    borderWidth: theme.tooltip.borderWidth,
    extraCssText: [
      `backdrop-filter: blur(${theme.tooltip.blur})`,
      `border-radius: ${theme.tooltip.radius}`,
      `box-shadow: ${theme.tooltip.shadow}`,
    ].join(';'),
    formatter: createTooltipFormatter({
      chartType,
      isSelectionSource,
      selection,
      spec,
    }),
    show: tooltip.enabled,
    showDelay: tooltip.delay,
    textStyle: {
      color: theme.text,
      fontSize: theme.tooltip.fontSize,
    },
    trigger: isRadialChartType(chartType) ? 'item' : tooltip.trigger,
  }
}
