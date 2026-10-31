import { createAxisLabelFormatter } from './createAxisLabelFormatter'
import { createStrokeStyleOption } from './createStrokeStyleOption'
import { createTextStyleOption } from './createTextStyleOption'

import type { XAxisComponentOption, YAxisComponentOption } from 'echarts'
import type {
  AxisAppearance,
  AxisTitleAppearance,
  ChartAppearanceSpec,
  ChartEncoding,
  ChartType,
} from '../types'

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
/**
 * Name ECharts shows at an axis: the own title text, else the field.
 * @param title Title of the axis.
 * @param fallback Name of the field on the axis.
 * @returns The name, or an empty one while the title is hidden.
 */
function getAxisName(title: AxisTitleAppearance, fallback = ''): string {
  return title.visible ? title.text.trim() || fallback : ''
}

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
 * @returns Axis line option of the axis.
 */
function createAxisLineOption(
  axis: AxisAppearance,
): XAxisComponentOption['axisLine'] {
  return {
    lineStyle: createStrokeStyleOption(axis.line.stroke),
    show: axis.visible && axis.line.visible,
  }
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
  return {
    lineStyle: createStrokeStyleOption(axis.gridLines.stroke),
    show: axis.visible && axis.gridLines.visible,
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
      axisLine: createAxisLineOption(appearance.xAxis),
      axisTick: {
        show: appearance.xAxis.visible,
      },
      data: isCategoryXAxis ? categories : undefined,
      max: appearance.xAxis.max ?? undefined,
      min: appearance.xAxis.min ?? undefined,
      name: getAxisName(appearance.xAxis.title, encoding.x),
      nameGap: 32,
      nameLocation: 'middle',
      nameTextStyle: createTextStyleOption(appearance.xAxis.title.textStyle),
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
      axisLine: createAxisLineOption(appearance.yAxis),
      axisTick: {
        show: appearance.yAxis.visible,
      },
      max: appearance.yAxis.max ?? undefined,
      min: appearance.yAxis.min ?? undefined,
      name: getAxisName(appearance.yAxis.title, valueLabel),
      nameGap: 48,
      nameLocation: 'middle',
      nameTextStyle: createTextStyleOption(appearance.yAxis.title.textStyle),
      show: appearance.yAxis.visible,
      splitLine: createSplitLineOption(appearance.yAxis),
      splitNumber: appearance.yAxis.labels.tickCount ?? undefined,
      triggerEvent: true,
      type: 'value',
    },
  }
}
