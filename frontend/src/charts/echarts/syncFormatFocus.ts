import type { ECharts } from 'echarts'

import type { ChartFormatElement } from '../types'

// ===== CONSTANTS =============================================================
const FOCUS_DIMMED_OPACITY = 0.25
const FOCUS_GLOW_BLUR = 15

// ===== FUNCTION ==============================================================
/**
 * Dims the chart content while a format popover is open and lets the
 * formatted axis or legend glow. ECharts draws both, so they follow layout
 * changes. The glow keeps the text colors, which the popover edits; legend
 * icons inherit the dimmed series opacity, so a formatted legend resets it.
 * @param instance ECharts instance of the chart.
 * @param formattedElement Element in the popover, or null when it is closed.
 * @param color Accent color of the glow.
 */
export function syncFormatFocus(
  instance: ECharts,
  formattedElement: ChartFormatElement | null,
  color: string,
): void {
  if (!formattedElement) {
    return
  }
  const dimmedStyle = { opacity: FOCUS_DIMMED_OPACITY }
  const textGlow = { textShadowBlur: FOCUS_GLOW_BLUR, textShadowColor: color }
  const highlight = {
    axisLabel: textGlow,
    axisLine: {
      lineStyle: {
        shadowBlur: FOCUS_GLOW_BLUR,
        shadowColor: color,
        width: 2,
      },
    },
    nameTextStyle: textGlow,
  }
  const dimmed = {
    axisLabel: dimmedStyle,
    axisLine: { lineStyle: dimmedStyle },
    axisTick: { lineStyle: dimmedStyle },
    nameTextStyle: dimmedStyle,
  }
  const legend =
    formattedElement === 'legend'
      ? {
          itemStyle: { opacity: 1 },
          lineStyle: { opacity: 1 },
          textStyle: textGlow,
        }
      : { textStyle: dimmedStyle }
  const { series = [], xAxis = [] } = instance.getOption() as {
    series?: { areaStyle?: object }[]
    xAxis?: object[]
  }
  // Radial charts have no axes; setting them would create empty ones.
  const axes =
    xAxis.length > 0
      ? {
          xAxis: formattedElement === 'xAxis' ? highlight : dimmed,
          yAxis: formattedElement === 'yAxis' ? highlight : dimmed,
        }
      : {}
  instance.setOption({
    ...axes,
    legend,
    series: series.map(({ areaStyle }) => ({
      areaStyle: areaStyle ? dimmedStyle : undefined,
      itemStyle: dimmedStyle,
      label: dimmedStyle,
      lineStyle: dimmedStyle,
    })),
  })
}
