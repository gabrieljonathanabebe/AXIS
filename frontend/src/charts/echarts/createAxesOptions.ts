import { createAxisLabelFormatter } from './createAxisLabelFormatter'
import { createStrokeStyleOption } from './createStrokeStyleOption'
import { createTextStyleOption } from './createTextStyleOption'

import type { XAxisComponentOption, YAxisComponentOption } from 'echarts'
import type {
  AxisAppearance,
  ChartAppearanceSpec,
  ChartEncoding,
  ChartType,
} from '../types'
import type { ChartTheme } from './chartTheme'

// ===== TYPES =================================================================
type CreateAxesOptionsParams = {
  appearance: ChartAppearanceSpec
  categories: string[]
  chartType: ChartType
  encoding: ChartEncoding
  theme: ChartTheme
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
 * Creates the line of one axis. Like the gridlines, it follows the axis: a
 * hidden axis hides its line too.
 * @param axis Appearance of the axis.
 * @param theme Chart theme that resolves the line color.
 * @returns Axis line option of the axis.
 */
function createAxisLineOption(
  axis: AxisAppearance,
  theme: ChartTheme,
): XAxisComponentOption['axisLine'] {
  return {
    lineStyle: createStrokeStyleOption(axis.line.stroke, theme),
    show: axis.visible && axis.line.visible,
  }
}

/**
 * Creates the gridlines of one axis. They follow the axis: a hidden axis
 * hides its gridlines too.
 * @param axis Appearance of the axis.
 * @param theme Chart theme that resolves the gridline color.
 * @returns Split line option of the axis.
 */
function createSplitLineOption(
  axis: AxisAppearance,
  theme: ChartTheme,
): XAxisComponentOption['splitLine'] {
  return {
    lineStyle: createStrokeStyleOption(axis.gridLines.stroke, theme),
    show: axis.visible && axis.gridLines.visible,
  }
}

// ===== FUNCTION ==============================================================
export function createAxesOptions({
  appearance,
  categories,
  chartType,
  encoding,
  theme,
  valueLabel,
}: CreateAxesOptionsParams): AxesOptions {
  const isCategoryXAxis = chartType !== 'scatter'
  return {
    xAxis: {
      axisLabel: {
        ...createTextStyleOption(appearance.xAxis.labels.textStyle, theme),
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
      axisLine: createAxisLineOption(appearance.xAxis, theme),
      axisTick: {
        show: appearance.xAxis.visible,
      },
      data: isCategoryXAxis ? categories : undefined,
      max: appearance.xAxis.max ?? undefined,
      min: appearance.xAxis.min ?? undefined,
      name: appearance.xAxis.title.text.trim() || encoding.x || '',
      nameGap: 32,
      nameLocation: 'middle',
      nameTextStyle: createTextStyleOption(
        appearance.xAxis.title.textStyle,
        theme,
      ),
      show: appearance.xAxis.visible,
      splitLine: createSplitLineOption(appearance.xAxis, theme),
      splitNumber: isCategoryXAxis
        ? undefined
        : (appearance.xAxis.labels.tickCount ?? undefined),
      triggerEvent: true,
      type: isCategoryXAxis ? 'category' : 'value',
    },
    yAxis: {
      axisLabel: {
        ...createTextStyleOption(appearance.yAxis.labels.textStyle, theme),
        formatter: createAxisLabelFormatter(appearance.yAxis),
        rotate: appearance.yAxis.labels.rotation,
        show: appearance.yAxis.visible,
      },
      axisLine: createAxisLineOption(appearance.yAxis, theme),
      axisTick: {
        show: appearance.yAxis.visible,
      },
      max: appearance.yAxis.max ?? undefined,
      min: appearance.yAxis.min ?? undefined,
      name: appearance.yAxis.title.text.trim() || valueLabel || '',
      nameGap: 48,
      nameLocation: 'middle',
      nameTextStyle: createTextStyleOption(
        appearance.yAxis.title.textStyle,
        theme,
      ),
      show: appearance.yAxis.visible,
      splitLine: createSplitLineOption(appearance.yAxis, theme),
      splitNumber: appearance.yAxis.labels.tickCount ?? undefined,
      triggerEvent: true,
      type: 'value',
    },
  }
}
