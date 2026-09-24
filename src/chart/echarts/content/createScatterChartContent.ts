import type { ScatterSeriesOption } from 'echarts'

import type {
  ChartAppearanceSpec,
  DataValue,
  Dataset,
} from '../../../types/chart'
import { createAxesOptions } from '../createAxesOptions'
import { createScatterVisualMaps } from '../createScatterVisualMaps'
import { createSeriesLabelOption } from '../createSeriesLabelOption'

import type { ChartContent, ChartContentContext } from './chartContentTypes'

// ===== TYPES =================================================================
type ScatterData = DataValue[][]

type CreateScatterSeriesParams = {
  appearance: ChartAppearanceSpec
  data: ScatterData
  itemColor: string | undefined
  name?: string
  sizeFieldName?: string
}

// ===== HELPER ================================================================
function getValue(row: Dataset['rows'][number], fieldName?: string): DataValue {
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
  const { chartType, dataset, spec, theme } = context
  const { appearance } = spec
  const { encoding } = spec.data
  const colorField = encoding.color
  const colorFieldName = colorField?.name
  const sizeFieldName = encoding.size?.name
  const rows = dataset.rows
  const data = rows.map((row) => [
    getValue(row, encoding.x?.name),
    getValue(row, encoding.y?.name),
    getValue(row, sizeFieldName),
    getValue(row, colorFieldName),
  ])
  const categoryFieldName =
    colorField?.semantic_type === 'categorical' ? colorField.name : null
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
    visualMap: createScatterVisualMaps({ appearance, encoding, rows }),
    xAxis,
    yAxis,
  }
}
