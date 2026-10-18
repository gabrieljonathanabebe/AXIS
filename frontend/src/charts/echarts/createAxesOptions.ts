import type { XAxisComponentOption, YAxisComponentOption } from 'echarts'

import type {
  AxisAppearance,
  ChartAppearanceSpec,
  ChartEncoding,
  ChartType,
} from '../types'
import { createAxisLabelFormatter } from './createAxisLabelFormatter'
import { createTextStyleOption } from './createTextStyleOption'

// ===== TYPES =================================================================
type CreateAxesOptionsParams = {
  appearance: ChartAppearanceSpec
  categories: string[]
  chartType: ChartType
  encoding: ChartEncoding
  valueLabel: string | undefined
}

type AxesOptions = {
  xAxis: XAxisComponentOption
  yAxis: YAxisComponentOption
}

// ===== HELPERS ===============================================================
function getCategoryLabelInterval(
  tickCount: number | null,
  categoryCount: number,
): number | 'auto' {
  if (tickCount === null) {
    return 'auto'
  }
  return Math.max(Math.ceil(categoryCount / tickCount) - 1, 0)
}

/**
 * Creates the gridlines of one axis. They follow the axis: a hidden axis
 * hides its gridlines too.
 * @param axis Appearance of the axis.
 * @returns Split line option of the axis.
 */
function createSplitLineOption(
  axis: AxisAppearance,
): XAxisComponentOption['splitLine'] {
  const { gridLines } = axis
  return {
    lineStyle: {
      color: gridLines.color,
      opacity: gridLines.opacity,
      type: gridLines.lineStyle,
      width: 1,
    },
    show: axis.visible && gridLines.visible,
  }
}

// ===== FUNCTION ==============================================================
export function createAxesOptions({
  appearance,
  categories,
  chartType,
  encoding,
  valueLabel,
}: CreateAxesOptionsParams): AxesOptions {
  const isCategoryXAxis = chartType !== 'scatter'
  return {
    xAxis: {
      axisLabel: {
        ...createTextStyleOption(appearance.xAxis.labels.textStyle),
        formatter: createAxisLabelFormatter(appearance.xAxis),
        interval: isCategoryXAxis
          ? getCategoryLabelInterval(
              appearance.xAxis.labels.tickCount,
              categories.length,
            )
          : undefined,
        rotate: appearance.xAxis.labels.rotation,
        show: appearance.xAxis.visible,
      },
      axisLine: {
        show: appearance.xAxis.visible,
      },
      axisTick: {
        show: appearance.xAxis.visible,
      },
      data: isCategoryXAxis ? categories : undefined,
      max: appearance.xAxis.max ?? undefined,
      min: appearance.xAxis.min ?? undefined,
      name: appearance.xAxis.title.trim() || encoding.x || '',
      nameGap: 32,
      nameLocation: 'middle',
      nameTextStyle: createTextStyleOption(appearance.xAxis.titleStyle),
      show: appearance.xAxis.visible,
      splitLine: createSplitLineOption(appearance.xAxis),
      splitNumber: isCategoryXAxis
        ? undefined
        : (appearance.xAxis.labels.tickCount ?? undefined),
      triggerEvent: true,
      type: isCategoryXAxis ? 'category' : 'value',
    },
    yAxis: {
      axisLabel: {
        ...createTextStyleOption(appearance.yAxis.labels.textStyle),
        formatter: createAxisLabelFormatter(appearance.yAxis),
        rotate: appearance.yAxis.labels.rotation,
        show: appearance.yAxis.visible,
      },
      axisLine: {
        show: appearance.yAxis.visible,
      },
      axisTick: {
        show: appearance.yAxis.visible,
      },
      max: appearance.yAxis.max ?? undefined,
      min: appearance.yAxis.min ?? undefined,
      name: appearance.yAxis.title.trim() || valueLabel || '',
      nameGap: 48,
      nameLocation: 'middle',
      nameTextStyle: createTextStyleOption(appearance.yAxis.titleStyle),
      show: appearance.yAxis.visible,
      splitLine: createSplitLineOption(appearance.yAxis),
      splitNumber: appearance.yAxis.labels.tickCount ?? undefined,
      triggerEvent: true,
      type: 'value',
    },
  }
}
