import type { BarSeriesOption, LineSeriesOption } from 'echarts'

import type { ChartAppearanceSpec } from '../../../types/chart'
import { createSeriesLabelOption } from '../createSeriesLabelOption'
import { HIGHLIGHT_SERIES_PREFIX } from './selectionStyle'

// ===== TYPES =================================================================
export type AggregatedSeriesData = Array<
  number | null | [string, number | null, number | null]
>

type AggregatedChartType = 'bar' | 'line'

type CreateAggregatedSeriesOptionParams = {
  appearance: ChartAppearanceSpec
  chartType: AggregatedChartType
  color: string | undefined
  data: AggregatedSeriesData
  hasBarColor: boolean
  isHighlight: boolean
  name: string | null
  opacity: number | undefined
  xAxisIndex: number
}

type AggregatedSeriesOption = BarSeriesOption | LineSeriesOption

// ===== FUNCTION ==============================================================
export function createAggregatedSeriesOption({
  appearance,
  chartType,
  color,
  data,
  hasBarColor,
  isHighlight,
  name,
  opacity,
  xAxisIndex,
}: CreateAggregatedSeriesOptionParams): AggregatedSeriesOption {
  // ===== CONSTANTS ===========================================================
  const label = {
    ...createSeriesLabelOption(appearance.labels),
    show: opacity === undefined && appearance.labels.enabled,
  }
  const id = isHighlight ? `${HIGHLIGHT_SERIES_PREFIX}${name ?? ''}` : undefined

  // ===== RETURN ==============================================================
  if (chartType === 'line') {
    return {
      areaStyle: appearance.line.areaFill
        ? {
            color: appearance.line.areaColor,
            opacity: appearance.line.areaOpacity * (opacity ?? 1),
          }
        : undefined,
      connectNulls: isHighlight,
      data,
      id,
      itemStyle: { color, opacity },
      label,
      lineStyle: {
        color,
        opacity,
        type: appearance.line.lineStyle,
        width: appearance.line.lineWidth,
      },
      name: name ?? undefined,
      showSymbol: isHighlight || appearance.line.showSymbol,
      smooth: appearance.line.smooth,
      type: 'line',
      xAxisIndex,
    }
  }
  return {
    barWidth: appearance.bar.barWidth,
    data,
    dimensions: hasBarColor ? ['category', 'value', 'colorValue'] : undefined,
    encode: hasBarColor
      ? {
          x: 'category',
          y: 'value',
        }
      : undefined,
    id,
    itemStyle: {
      borderRadius: appearance.bar.borderRadius,
      color,
      opacity,
    },
    label,
    name: name ?? undefined,
    type: 'bar',
    xAxisIndex,
  }
}
