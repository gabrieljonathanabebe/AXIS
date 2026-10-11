import type { ECElementEvent, ECharts } from 'echarts'

import type { AxisTitleEdit } from '../types'

// ===== CONSTANTS =============================================================
const axisByComponentType: Partial<Record<string, AxisTitleEdit['axis']>> = {
  xAxis: 'x',
  yAxis: 'y',
}

const FOCUS_DIMMED_OPACITY = 0.25
const FOCUS_GLOW_BLUR = 15

// ===== FUNCTIONS =============================================================
export function isAxisTitleEvent(event: ECElementEvent): boolean {
  return (
    axisByComponentType[event.componentType] !== undefined &&
    event.targetType === 'axisName'
  )
}

export function createAxisTitleEditFromEvent(
  event: ECElementEvent,
): AxisTitleEdit | null {
  const axis = axisByComponentType[event.componentType]
  const target = event.event?.target
  if (!axis || !target || !isAxisTitleEvent(event)) {
    return null
  }
  const rect = target.getBoundingRect().clone()
  const transform = target.getComputedTransform()
  if (transform) {
    rect.applyTransform(transform)
  }
  return {
    axis,
    rect: {
      height: rect.height,
      width: rect.width,
      x: rect.x,
      y: rect.y,
    },
  }
}

export function syncAxisTitleEdit(
  instance: ECharts,
  editingAxis: AxisTitleEdit['axis'] | null,
): void {
  if (!editingAxis) {
    return
  }
  const hiddenName = { nameTextStyle: { opacity: 0 } }
  instance.setOption(
    editingAxis === 'x' ? { xAxis: hiddenName } : { yAxis: hiddenName },
  )
}

// Lets the axis whose format popover is open glow and dims series and
// the other axis. ECharts draws both, so they follow layout changes.
// The glow keeps the text colors, which the popover edits.
export function syncAxisHighlight(
  instance: ECharts,
  highlightedAxis: AxisTitleEdit['axis'] | null,
  color: string,
): void {
  if (!highlightedAxis) {
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
  const { series = [] } = instance.getOption() as {
    series?: { areaStyle?: object }[]
  }
  instance.setOption({
    series: series.map(({ areaStyle }) => ({
      areaStyle: areaStyle ? dimmedStyle : undefined,
      itemStyle: dimmedStyle,
      label: dimmedStyle,
      lineStyle: dimmedStyle,
    })),
    xAxis: highlightedAxis === 'x' ? highlight : dimmed,
    yAxis: highlightedAxis === 'y' ? highlight : dimmed,
  })
}
