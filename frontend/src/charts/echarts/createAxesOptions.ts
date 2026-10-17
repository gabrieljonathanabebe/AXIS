import type { XAxisComponentOption, YAxisComponentOption } from 'echarts'

import type { ChartAppearanceSpec, ChartEncoding, ChartType } from '../types'
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
      splitLine: {
        lineStyle: {
          color: appearance.grid.color,
          opacity: appearance.grid.opacity,
          type: appearance.grid.lineStyle,
          width: 1,
        },
        show: appearance.xAxis.visible && appearance.grid.visible,
      },
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
      splitLine: {
        lineStyle: {
          color: appearance.grid.color,
          opacity: appearance.grid.opacity,
          type: appearance.grid.lineStyle,
          width: 1,
        },
        show: appearance.yAxis.visible && appearance.grid.visible,
      },
      splitNumber: appearance.yAxis.labels.tickCount ?? undefined,
      triggerEvent: true,
      type: 'value',
    },
  }
}
