import type { XAxisComponentOption, YAxisComponentOption } from 'echarts'

import type {
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

// ===== FUNCTION ==============================================================
export function createAxesOptions({
  appearance,
  categories,
  chartType,
  encoding,
  theme,
}: CreateAxesOptionsParams): AxesOptions {
  return {
    xAxis: {
      axisLabel: {
        color: theme.text,
        formatter: createAxisLabelFormatter(appearance.xAxis),
        show: appearance.xAxis.enabled,
      },
      axisLine: {
        show: appearance.xAxis.enabled,
      },
      axisTick: {
        show: appearance.xAxis.enabled,
      },
      data: chartType === 'scatter' ? undefined : categories,
      max: appearance.xAxis.max ?? undefined,
      min: appearance.xAxis.min ?? undefined,
      name: appearance.xAxis.title.trim() || encoding.x?.name || '',
      nameGap: 32,
      nameLocation: 'middle',
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
      type: chartType === 'scatter' ? 'value' : 'category',
    },
    yAxis: {
      axisLabel: {
        color: theme.text,
        formatter: createAxisLabelFormatter(appearance.yAxis),
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
      name: appearance.yAxis.title.trim() || encoding.y?.name || '',
      nameGap: 48,
      nameLocation: 'middle',
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
      type: 'value',
    },
  }
}
