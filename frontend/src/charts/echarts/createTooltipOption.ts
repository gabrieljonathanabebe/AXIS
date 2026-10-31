import { getColorCss } from '../../shared/colorValue'
import { getShadowsCss } from '../../shared/effect'
import { getFillsCss } from '../../shared/fill'
import { getPaintColor } from '../../shared/paint'
import { isRadialChartType } from '../chartDefinitions'
import { createTooltipFormatter } from './createTooltipFormatter'

import type { TooltipComponentOption } from 'echarts'
import type { DataSelection } from '../../workspace/types'
import type { ChartSpec, ChartType } from '../types'
import type { ChartTheme } from './chartTheme'

// ===== TYPES =================================================================
type CreateTooltipOptionsParams = {
  chartType: ChartType
  isSelectionSource: boolean
  selection: DataSelection | null
  spec: ChartSpec
  theme: ChartTheme
  valueLabel: string | undefined
}

// ===== FUNCTION ==============================================================
/**
 * Creates the tooltip of a chart: content from the spec, look from the
 * dashboard style, drawn as HTML with CSS of the shared building blocks.
 */
export function createTooltipOption({
  chartType,
  isSelectionSource,
  selection,
  spec,
  theme,
  valueLabel,
}: CreateTooltipOptionsParams): TooltipComponentOption {
  const { tooltip } = spec.interaction
  const { colors, tooltip: tooltipStyle } = theme.style
  const { border } = tooltipStyle
  const borderColor = getColorCss(getPaintColor(border.paint), border.opacity)
  return {
    appendTo: 'body',
    backgroundColor: 'transparent',
    borderWidth: 0,
    extraCssText: [
      `--chart-tooltip-text: ${colors.text}`,
      `--chart-tooltip-text-muted: ${colors.textMuted}`,
      `backdrop-filter: blur(${tooltipStyle.blur}px)`,
      `background: ${getFillsCss([tooltipStyle.background])}`,
      `border: ${border.width}px ${border.lineStyle} ${borderColor}`,
      `border-radius: ${tooltipStyle.radius}px`,
      `box-shadow: ${getShadowsCss([tooltipStyle.shadow])}`,
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
      color: colors.text,
      fontSize: tooltipStyle.fontSize,
    },
    trigger: isRadialChartType(chartType) ? 'item' : tooltip.trigger,
  }
}
