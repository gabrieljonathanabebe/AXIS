import { isRowInSelection } from '../../../workspace/dataSelection'
import { getColorEncodingMode } from '../../getColorEncodingMode'
import { getValueLabel } from '../../getEffectiveAggregation'
import { createAxesOptions } from '../createAxesOptions'
import { createEffectOption } from '../createEffectOption'
import { createFillOption } from '../createFillOption'
import { createScatterVisualMaps } from '../createScatterVisualMaps'
import {
  createLabelNumberFormatter,
  createSeriesLabelOption,
} from '../createSeriesLabelOption'
import { createBorderOption } from '../createStrokeStyleOption'
import { getNumericDomain } from '../getNumericDomain'
import { getPaletteColor, resolveColor, resolvePalette } from '../resolveColor'
import { DIMMED_OPACITY } from './selectionStyle'

import type { ScatterSeriesOption } from 'echarts'
import type { DataRow, DataValue } from '../../../datasets/types'
import type { ChartAppearanceSpec, ScatterSizeRange } from '../../types'
import type { ChartTheme } from '../chartTheme'
import type { ChartContent, ChartContentContext } from './chartContentTypes'

// ===== TYPES =================================================================
type ScatterData = Array<{
  itemStyle: { opacity: number; shadowColor: string } | undefined
  value: DataValue[]
}>

/** Size of a point in pixels: one for all, or one per point by its value. */
type ScatterSymbolSize = number | ((value: DataValue[]) => number)

type CreateScatterSeriesParams = {
  appearance: ChartAppearanceSpec
  canGlow: boolean
  data: ScatterData
  itemColor: string | undefined
  name?: string
  symbolSize: ScatterSymbolSize
  theme: ChartTheme
}

// ===== CONSTANTS =============================================================
/**
 * Most points a scatter chart draws with a glow: every point blurs its own
 * shadow, which slows drawing, hover and brushing.
 */
const MAX_GLOW_POINTS = 500

// ===== HELPER ================================================================
/** Reads the value of one field from a point, or null without a field. */
function getValue(row: DataRow, fieldName?: string): DataValue {
  if (!fieldName) {
    return null
  }
  return row[fieldName]
}

/**
 * Sizes points by their size value so that the area, not the diameter,
 * grows with the value: the largest value gets the largest size, smaller
 * values the square root of their share, never below the smallest size.
 * @param maxValue Largest size value of the chart.
 * @param sizeRange Smallest and largest point size in pixels.
 * @returns Size of one point for ECharts; the size value is dimension 2.
 */
function createAreaSymbolSize(
  maxValue: number,
  { max, min }: ScatterSizeRange,
): (value: DataValue[]) => number {
  return (value) => {
    const size = value[2]
    if (typeof size !== 'number' || size <= 0 || maxValue <= 0) {
      return min
    }
    return Math.max(min, max * Math.sqrt(size / maxValue))
  }
}

/**
 * Creates one scatter series; with a categorical color, one per category.
 * @param params Appearance, points and color of the series, and whether the
 *   chart is small enough for a glow.
 * @returns Scatter series with fill, border, glow, labels, symbol and size.
 */
function createScatterSeries({
  appearance,
  canGlow,
  data,
  itemColor,
  name,
  symbolSize,
  theme,
}: CreateScatterSeriesParams): ScatterSeriesOption {
  return {
    data,
    encode: {
      x: 0,
      y: 1,
    },
    itemStyle: {
      ...createFillOption(appearance.scatter.fill, theme, itemColor),
      ...createBorderOption(appearance.scatter.border, theme),
      ...createEffectOption(
        appearance.scatter.effect,
        theme,
        canGlow ? itemColor : undefined,
      ),
    },
    label: createSeriesLabelOption(
      appearance.labels,
      theme,
      createLabelNumberFormatter(appearance),
    ),
    labelLayout: { hideOverlap: true },
    name,
    symbol: appearance.scatter.symbol,
    symbolSize,
    type: 'scatter',
  }
}

// ===== FUNCTION ==============================================================
export function createScatterChartContent(
  context: ChartContentContext,
): ChartContent {
  // ===== CONSTANTS ===========================================================
  const { chartType, dataset, points, selection, spec, theme } = context
  const { appearance } = spec
  const { encoding } = spec.data
  const colorFieldName = encoding.color
  const sizeFieldName = encoding.size
  const colorEncodingMode = getColorEncodingMode(
    chartType,
    encoding,
    dataset.fields,
  )
  const rows = points
  const canGlow = rows.length <= MAX_GLOW_POINTS
  const sizeDomain = sizeFieldName
    ? getNumericDomain(rows.map((row) => row[sizeFieldName]))
    : null
  const symbolSize = sizeDomain
    ? createAreaSymbolSize(sizeDomain.max, appearance.scatter.sizeRange)
    : appearance.scatter.pointSize
  const data = rows.map((row) => ({
    itemStyle: isRowInSelection(row, selection)
      ? undefined
      : { opacity: DIMMED_OPACITY, shadowColor: 'transparent' },
    value: [
      getValue(row, encoding.x),
      getValue(row, encoding.y),
      getValue(row, sizeFieldName),
      getValue(row, colorFieldName),
    ],
  }))

  const categoryFieldName =
    colorEncodingMode === 'categorical' ? (colorFieldName ?? null) : null

  const categoryNames = categoryFieldName
    ? Array.from(
        new Set(
          rows.map((row) => {
            return String(row[categoryFieldName] ?? '(empty)')
          }),
        ),
      )
    : []
  const palette = resolvePalette(
    appearance.colorScale.categorical.palette,
    theme,
  )

  let series: ScatterSeriesOption[]

  if (categoryFieldName && categoryNames.length > 0) {
    series = categoryNames.map((name, index) => {
      const seriesData = data.filter((_, rowIndex) => {
        const value = rows[rowIndex][categoryFieldName]
        return String(value ?? '(empty)') === name
      })
      return createScatterSeries({
        appearance,
        canGlow,
        data: seriesData,
        itemColor: getPaletteColor(palette, index),
        name,
        symbolSize,
        theme,
      })
    })
  } else {
    series = [
      createScatterSeries({
        appearance,
        canGlow,
        data,
        itemColor: colorFieldName
          ? undefined
          : resolveColor(appearance.color, theme),
        symbolSize,
        theme,
      }),
    ]
  }

  const { xAxis, yAxis } = createAxesOptions({
    appearance,
    categories: [],
    chartType,
    encoding,
    theme,
    valueLabel: getValueLabel(spec.data, dataset.fields),
  })

  return {
    series,
    visualMap: createScatterVisualMaps({
      appearance,
      colorEncodingMode,
      encoding,
      rows,
      theme,
    }),
    xAxis,
    yAxis,
  }
}
