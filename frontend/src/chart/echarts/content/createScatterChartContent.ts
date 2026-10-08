import type { ScatterSeriesOption } from 'echarts'

import type { ChartAppearanceSpec } from '../../../types/chart'
import type { DataRow, DataValue } from '../../../datasets/types'

import { createAxesOptions } from '../createAxesOptions'
import { createScatterVisualMaps } from '../createScatterVisualMaps'
import { createSeriesLabelOption } from '../createSeriesLabelOption'
import { DIMMED_OPACITY } from './selectionStyle'
import { getColorEncodingMode } from '../../getColorEncodingMode'
import { isRowInSelection } from '../../../workspace/dataSelection'
import type { ChartContent, ChartContentContext } from './chartContentTypes'

// ===== TYPES =================================================================
type ScatterData = Array<{
  itemStyle: { opacity: number } | undefined
  value: DataValue[]
}>

type CreateScatterSeriesParams = {
  appearance: ChartAppearanceSpec
  data: ScatterData
  itemColor: string | undefined
  name?: string
  sizeFieldName?: string
}

// ===== HELPER ================================================================
function getValue(row: DataRow, fieldName?: string): DataValue {
  if (!fieldName) {
    return null
  }
  return row[fieldName]
}

function createScatterSeries({
  appearance,
  data,
  itemColor,
  name,
  sizeFieldName,
}: CreateScatterSeriesParams): ScatterSeriesOption {
  return {
    data,
    encode: {
      x: 0,
      y: 1,
    },
    itemStyle: {
      color: itemColor,
      opacity: appearance.scatter.opacity,
    },
    label: createSeriesLabelOption(appearance.labels),
    name,
    symbol: appearance.scatter.symbol,
    symbolSize: sizeFieldName ? undefined : appearance.scatter.pointSize,
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

  const data = rows.map((row) => ({
    itemStyle: isRowInSelection(row, selection)
      ? undefined
      : { opacity: DIMMED_OPACITY },
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
  const palette = appearance.colorScale.categorical.palette

  let series: ScatterSeriesOption[]

  if (categoryFieldName && categoryNames.length > 0) {
    series = categoryNames.map((name, index) => {
      const seriesData = data.filter((_, rowIndex) => {
        const value = rows[rowIndex][categoryFieldName]
        return String(value ?? '(empty)') === name
      })
      return createScatterSeries({
        appearance,
        data: seriesData,
        itemColor: palette[index % palette.length],
        name,
        sizeFieldName,
      })
    })
  } else {
    series = [
      createScatterSeries({
        appearance,
        data,
        itemColor: colorFieldName ? undefined : appearance.color,
        sizeFieldName,
      }),
    ]
  }

  const { xAxis, yAxis } = createAxesOptions({
    appearance,
    categories: [],
    chartType,
    encoding,
    theme,
  })

  return {
    series,
    visualMap: createScatterVisualMaps({
      appearance,
      colorEncodingMode,
      encoding,
      rows,
    }),
    xAxis,
    yAxis,
  }
}
