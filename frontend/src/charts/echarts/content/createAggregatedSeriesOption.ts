import { createEffectOption } from '../createEffectOption'
import { createFillOption } from '../createFillOption'
import {
  createLabelNumberFormatter,
  createSeriesLabelOption,
} from '../createSeriesLabelOption'
import { createStrokeStyleOption } from '../createStrokeStyleOption'
import { HIGHLIGHT_SERIES_PREFIX } from './selectionStyle'

import type { BarSeriesOption, LineSeriesOption } from 'echarts'
import type { ChartAppearanceSpec } from '../../types'
import type { ChartTheme } from '../chartTheme'

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
  hasColorValue: boolean
  isHighlight: boolean
  name: string | null
  opacity: number | undefined
  theme: ChartTheme
  xAxisIndex: number
}

type AggregatedSeriesOption = BarSeriesOption | LineSeriesOption

// ===== CONSTANTS =============================================================
// Above this many points, line symbols merge into a bead chain.
const MAX_LINE_SYMBOLS = 30

// ===== FUNCTION ==============================================================
/**
 * Builds one bar or line series of an aggregated chart. Base series that a
 * selection dims get no glow, so the highlighted part stands out.
 * @param params Appearance, chart type, color, data and selection state of
 * the series.
 * @returns Series option for ECharts.
 */
export function createAggregatedSeriesOption({
  appearance,
  chartType,
  color,
  data,
  hasColorValue,
  isHighlight,
  name,
  opacity,
  theme,
  xAxisIndex,
}: CreateAggregatedSeriesOptionParams): AggregatedSeriesOption {
  // ===== CONSTANTS ===========================================================
  const label = {
    ...createSeriesLabelOption(
      appearance.labels,
      theme,
      createLabelNumberFormatter(appearance),
    ),
    show: opacity === undefined && appearance.labels.visible,
  }
  const id = isHighlight ? `${HIGHLIGHT_SERIES_PREFIX}${name ?? ''}` : undefined
  const glowColor = opacity === undefined ? color : undefined

  // ===== RETURN ==============================================================
  if (chartType === 'line') {
    return {
      areaStyle: appearance.line.areaFill
        ? {
            ...createFillOption(appearance.line.area, theme),
            color,
            opacity: appearance.line.area.opacity * (opacity ?? 1),
          }
        : undefined,
      connectNulls: isHighlight,
      data,
      id,
      itemStyle: { color, opacity },
      label,
      lineStyle: {
        ...createStrokeStyleOption(appearance.line.stroke, theme),
        ...createEffectOption(appearance.line.effect, glowColor),
        color,
        opacity: appearance.line.stroke.opacity * (opacity ?? 1),
      },
      name: name ?? undefined,
      showSymbol:
        isHighlight ||
        (appearance.line.showSymbol && data.length <= MAX_LINE_SYMBOLS),
      smooth: appearance.line.smooth,
      triggerEvent: true,
      type: 'line',
      xAxisIndex,
    }
  }
  return {
    barWidth: appearance.bar.barWidth,
    data,
    dimensions: hasColorValue ? ['category', 'value', 'colorValue'] : undefined,
    encode: hasColorValue
      ? {
          x: 'category',
          y: 'value',
        }
      : undefined,
    id,
    itemStyle: {
      ...createEffectOption(appearance.bar.effect, glowColor),
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
