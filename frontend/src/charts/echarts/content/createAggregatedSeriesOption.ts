import { createEffectOption } from '../createEffectOption'
import { createFillOption } from '../createFillOption'
import {
  createLabelNumberFormatter,
  createSeriesLabelOption,
} from '../createSeriesLabelOption'
import {
  createBorderOption,
  createStrokeStyleOption,
} from '../createStrokeStyleOption'
import { HIGHLIGHT_SERIES_PREFIX } from './selectionStyle'

import type { BarSeriesOption, LineSeriesOption } from 'echarts'
import type { ChartAppearanceSpec, LinePoints } from '../../types'
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
/** Above this many points, line symbols merge into a bead chain. */
const MAX_LINE_SYMBOLS = 30

/**
 * Size of visible line points, the ECharts default. Set explicitly because
 * `symbolSize: undefined` would replace the default and hide the points.
 */
const LINE_SYMBOL_SIZE = 6

// ===== HELPERS ===============================================================
/**
 * Tells whether a line shows its points: always, never, or in auto mode
 * only up to `MAX_LINE_SYMBOLS`.
 * @param points Points setting of the line.
 * @param count Number of data points of the series.
 * @returns True when ECharts draws the symbols.
 */
function showsLinePoints(points: LinePoints, count: number): boolean {
  return points === 'auto' ? count <= MAX_LINE_SYMBOLS : points === 'on'
}

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
    const showsPoints =
      isHighlight || showsLinePoints(appearance.line.points, data.length)
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
      labelLayout: { hideOverlap: true },
      lineStyle: {
        ...createStrokeStyleOption(appearance.line.stroke, theme),
        ...createEffectOption(appearance.line.effect, glowColor),
        color,
        opacity: appearance.line.stroke.opacity * (opacity ?? 1),
      },
      name: name ?? undefined,
      showSymbol: showsPoints || label.show,
      smooth: appearance.line.smooth,
      symbolSize: showsPoints ? LINE_SYMBOL_SIZE : 0,
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
      ...createFillOption(appearance.bar.fill, theme),
      ...createBorderOption(appearance.bar.border, theme),
      ...createEffectOption(appearance.bar.effect, glowColor),
      borderRadius: appearance.bar.borderRadius,
      color,
      opacity: appearance.bar.fill.opacity * (opacity ?? 1),
    },
    label,
    name: name ?? undefined,
    type: 'bar',
    xAxisIndex,
  }
}
