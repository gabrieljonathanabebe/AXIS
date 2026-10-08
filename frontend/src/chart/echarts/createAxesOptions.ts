import { FONT_WEIGHT_VALUES } from '../fontWeights'
import type { XAxisComponentOption, YAxisComponentOption } from 'echarts'

import type {
  AxisTitleStyle,
  ChartAppearanceSpec,
  ChartEncoding,
  ChartType,
} from '../../types/chart'
import type { ChartTheme } from './chartTheme'
import { createAxisLabelFormatter } from './createAxisLabelFormatter'

// ===== TYPES =================================================================
type CreateAxesOptionsParams = {
  appearance: ChartAppearanceSpec
  categories: string[]
  chartType: ChartType
  encoding: ChartEncoding
  theme: ChartTheme
}

type AxesOptions = {
  xAxis: XAxisComponentOption
  yAxis: YAxisComponentOption
}

type AxisNameTextStyle = XAxisComponentOption['nameTextStyle']

// ===== HELPERS ===============================================================
function createAxisNameTextStyle(style: AxisTitleStyle): AxisNameTextStyle {
  return {
    color: style.color,
    fontSize: style.fontSize,
    fontWeight: FONT_WEIGHT_VALUES[style.fontWeight],
  }
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

// ===== FUNCTION ==============================================================
export function createAxesOptions({
  appearance,
  categories,
  chartType,
  encoding,
  theme,
}: CreateAxesOptionsParams): AxesOptions {
  const isCategoryXAxis = chartType !== 'scatter'
  return {
    xAxis: {
      axisLabel: {
        color: theme.text,
        formatter: createAxisLabelFormatter(appearance.xAxis),
        interval: isCategoryXAxis
          ? getCategoryLabelInterval(
              appearance.xAxis.labels.tickCount,
              categories.length,
            )
          : undefined,
        rotate: appearance.xAxis.labels.rotation,
        show: appearance.xAxis.enabled,
      },
      axisLine: {
        show: appearance.xAxis.enabled,
      },
      axisTick: {
        show: appearance.xAxis.enabled,
      },
      data: isCategoryXAxis ? categories : undefined,
      max: appearance.xAxis.max ?? undefined,
      min: appearance.xAxis.min ?? undefined,
      name: appearance.xAxis.title.trim() || encoding.x || '',
      nameGap: 32,
      nameLocation: 'middle',
      nameTextStyle: createAxisNameTextStyle(appearance.xAxis.titleStyle),
      show: appearance.xAxis.enabled,
      splitLine: {
        lineStyle: {
          color: appearance.grid.color,
          opacity: appearance.grid.opacity,
          type: appearance.grid.lineStyle,
          width: 1,
        },
        show: appearance.xAxis.enabled && appearance.grid.enabled,
      },
      splitNumber: isCategoryXAxis
        ? undefined
        : (appearance.xAxis.labels.tickCount ?? undefined),
      triggerEvent: true,
      type: isCategoryXAxis ? 'category' : 'value',
    },
    yAxis: {
      axisLabel: {
        color: theme.text,
        formatter: createAxisLabelFormatter(appearance.yAxis),
        rotate: appearance.yAxis.labels.rotation,
        show: appearance.yAxis.enabled,
      },
      axisLine: {
        show: appearance.yAxis.enabled,
      },
      axisTick: {
        show: appearance.yAxis.enabled,
      },
      max: appearance.yAxis.max ?? undefined,
      min: appearance.yAxis.min ?? undefined,
      name: appearance.yAxis.title.trim() || encoding.y || '',
      nameGap: 48,
      nameLocation: 'middle',
      nameTextStyle: createAxisNameTextStyle(appearance.yAxis.titleStyle),
      show: appearance.yAxis.enabled,
      splitLine: {
        lineStyle: {
          color: appearance.grid.color,
          opacity: appearance.grid.opacity,
          type: appearance.grid.lineStyle,
          width: 1,
        },
        show: appearance.yAxis.enabled && appearance.grid.enabled,
      },
      splitNumber: appearance.yAxis.labels.tickCount ?? undefined,
      triggerEvent: true,
      type: 'value',
    },
  }
}
