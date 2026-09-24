import type { TooltipComponentOption } from 'echarts'

import type { ChartSpec, ChartType } from '../../types/chart'
import type { ChartTheme } from './chartTheme'
import { createTooltipFormatter } from './createTooltipFormatter'

// ===== TYPES =================================================================
type CreateTooltipOptionsParams = {
  chartType: ChartType
  spec: ChartSpec
  theme: ChartTheme
}

// ===== FUNCTION ==============================================================
export function createTooltipOption({
  chartType,
  spec,
  theme,
}: CreateTooltipOptionsParams): TooltipComponentOption {
  const { tooltip } = spec.interaction
  return {
    backgroundColor: theme.tooltip.background,
    borderColor: theme.tooltip.borderColor,
    borderWidth: theme.tooltip.borderWidth,
    extraCssText: [
      `backdrop-filter: blur(${theme.tooltip.blur})`,
      `border-radius: ${theme.tooltip.radius}`,
      `box-shadow: ${theme.tooltip.shadow}`,
    ].join(';'),
    formatter: createTooltipFormatter(chartType, spec),
    show: tooltip.enabled,
    showDelay: tooltip.delay,
    textStyle: {
      color: theme.text,
      fontSize: theme.tooltip.fontSize,
    },
    trigger: tooltip.trigger,
  }
}
