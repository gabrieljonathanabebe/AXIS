import type { BarSeriesOption, LineSeriesOption } from 'echarts'

import type { ChartAppearanceSpec } from '../../../types/chart'
import type { ColorEncodingMode } from '../../getColorEncodingMode'
import { createSeriesLabelOption } from '../createSeriesLabelOption'

// ===== TYPES =================================================================
export type AggregatedSeriesData = Array<
  number | null | [string, number | null, number | null]
>

type AggregatedChartType = 'bar' | 'line'

type CreateAggregatedSeriesOptionParams = {
  appearance: ChartAppearanceSpec
  chartType: AggregatedChartType
  colorEncodingMode: ColorEncodingMode
  data: AggregatedSeriesData
  hasBarColor: boolean
  name: string | null
}

type AggregatedSeriesOption = BarSeriesOption | LineSeriesOption

// ===== FUNCTION ==============================================================
export function createAggregatedSeriesOption({
  appearance,
  chartType,
  colorEncodingMode,
  data,
  hasBarColor,
  name,
}: CreateAggregatedSeriesOptionParams): AggregatedSeriesOption {
  // ===== CONSTANTS ===========================================================
  const color = colorEncodingMode === 'constant' ? appearance.color : undefined
  const label = createSeriesLabelOption(appearance.labels)
  // ===== RETURN ==============================================================
  if (chartType === 'line') {
    return {
      areaStyle: appearance.line.areaFill
        ? {
            color: appearance.line.areaColor,
            opacity: appearance.line.areaOpacity,
          }
        : undefined,
      data,
      itemStyle: { color },
      label,
      lineStyle: {
        color,
        type: appearance.line.lineStyle,
        width: appearance.line.lineWidth,
      },
      name: name ?? undefined,
      showSymbol: appearance.line.showSymbol,
      smooth: appearance.line.smooth,
      type: 'line',
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
    itemStyle: {
      borderRadius: appearance.bar.borderRadius,
      color,
    },
    label,
    name: name ?? undefined,
    type: 'bar',
  }
}
