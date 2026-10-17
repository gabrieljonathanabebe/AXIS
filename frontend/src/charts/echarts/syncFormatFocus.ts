import type { ECharts } from 'echarts'

import type { ChartFormatElement } from '../types'

// ===== CONSTANTS =============================================================
const FOCUS_DIMMED_OPACITY = 0.25
const FOCUS_GLOW_BLUR = 15
const FOCUS_DIMMED_STYLE = { opacity: FOCUS_DIMMED_OPACITY }

// ===== HELPERS ===============================================================
/**
 * Builds the focus of one axis. The axis element lets line and title glow,
 * the labels element labels and ticks; the other part is dimmed.
 * @param axis Axis whose focus is built.
 * @param formattedElement Element in the popover.
 * @param color Accent color of the glow.
 * @returns Opacity and glow per part of the ECharts axis.
 */
function createAxisFocus(
  axis: 'x' | 'y',
  formattedElement: ChartFormatElement,
  color: string,
) {
  const isAxisFormatted = formattedElement === `${axis}Axis`
  const areLabelsFormatted = formattedElement === `${axis}AxisLabels`
  const textGlow = { textShadowBlur: FOCUS_GLOW_BLUR, textShadowColor: color }
  const lineGlow = { shadowBlur: FOCUS_GLOW_BLUR, shadowColor: color, width: 2 }
  return {
    axisLabel: areLabelsFormatted ? textGlow : FOCUS_DIMMED_STYLE,
    axisLine: { lineStyle: isAxisFormatted ? lineGlow : FOCUS_DIMMED_STYLE },
    axisTick: { lineStyle: areLabelsFormatted ? {} : FOCUS_DIMMED_STYLE },
    nameTextStyle: isAxisFormatted ? textGlow : FOCUS_DIMMED_STYLE,
  }
}

// ===== FUNCTION ==============================================================
/**
 * Dims the chart content while a format popover is open and lets the
 * formatted part of an axis or the legend glow. ECharts draws both, so they
 * follow layout changes. The glow keeps the text colors, which the popover
 * edits; legend icons inherit the dimmed series opacity, so a formatted
 * legend resets it.
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
  const textGlow = { textShadowBlur: FOCUS_GLOW_BLUR, textShadowColor: color }
  const legend =
    formattedElement === 'legend'
      ? {
          itemStyle: { opacity: 1 },
          lineStyle: { opacity: 1 },
          textStyle: textGlow,
        }
      : { textStyle: FOCUS_DIMMED_STYLE }
  const { series = [], xAxis = [] } = instance.getOption() as {
    series?: { areaStyle?: object }[]
    xAxis?: object[]
  }
  // Radial charts have no axes; setting them would create empty ones.
  const axes =
    xAxis.length > 0
      ? {
          xAxis: createAxisFocus('x', formattedElement, color),
          yAxis: createAxisFocus('y', formattedElement, color),
        }
      : {}
  instance.setOption({
    ...axes,
    legend,
    series: series.map(({ areaStyle }) => ({
      areaStyle: areaStyle ? FOCUS_DIMMED_STYLE : undefined,
      itemStyle: FOCUS_DIMMED_STYLE,
      label: FOCUS_DIMMED_STYLE,
      lineStyle: FOCUS_DIMMED_STYLE,
    })),
  })
}
