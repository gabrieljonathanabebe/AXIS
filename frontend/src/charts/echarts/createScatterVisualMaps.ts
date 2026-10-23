import { createContinuousColorVisualMap } from './createContinuousColorVisualMap'
import { getNumericDomain } from './getNumericDomain'

import type {
  ContinuousVisualMapComponentOption,
  VisualMapComponentOption,
} from 'echarts'
import type { DataRow } from '../../datasets/types'
import type { ColorEncodingMode } from '../getColorEncodingMode'
import type { ChartAppearanceSpec, ChartEncoding } from '../types'
import type { ChartTheme } from './chartTheme'

type CreateScatterVisualMapsParams = {
  rows: DataRow[]
  encoding: ChartEncoding
  appearance: ChartAppearanceSpec
  colorEncodingMode: ColorEncodingMode
  theme: ChartTheme
}

function createSizeVisualMap(
  rows: DataRow[],
  encoding: ChartEncoding,
  appearance: ChartAppearanceSpec,
): ContinuousVisualMapComponentOption | null {
  const fieldName = encoding.size

  if (!fieldName) {
    return null
  }

  const domain = getNumericDomain(rows.map((row) => row[fieldName]))

  if (!domain) {
    return null
  }

  return {
    show: false,
    type: 'continuous',
    dimension: 2,
    min: domain.min,
    max: domain.min === domain.max ? domain.min + 1 : domain.max,
    inRange: {
      symbolSize: [
        appearance.scatter.sizeRange.min,
        appearance.scatter.sizeRange.max,
      ],
    },
  }
}

/**
 * Creates the color scale of a continuous color field, if there is one.
 * @returns Visual map of the scale, or null without continuous color.
 */
function createColorVisualMap({
  appearance,
  colorEncodingMode,
  encoding,
  rows,
  theme,
}: CreateScatterVisualMapsParams): VisualMapComponentOption | null {
  const colorFieldName = encoding.color
  if (colorEncodingMode !== 'continuous' || !colorFieldName) {
    return null
  }
  const values = rows.map((row) => {
    const value = row[colorFieldName]
    return typeof value === 'number' ? value : null
  })
  return createContinuousColorVisualMap({
    appearance: appearance.colorScale.continuous,
    dimension: 3,
    theme,
    values,
  })
}

/**
 * Creates the hidden size scale and the visible color scale of a scatter chart.
 * @param params Points, fields, appearance and theme of the chart.
 * @returns Visual maps that apply to the chart.
 */
export function createScatterVisualMaps(
  params: CreateScatterVisualMapsParams,
): VisualMapComponentOption[] {
  const { appearance, encoding, rows } = params
  const visualMaps = [
    createSizeVisualMap(rows, encoding, appearance),
    createColorVisualMap(params),
  ]
  return visualMaps.filter(
    (visualMap): visualMap is VisualMapComponentOption => {
      return visualMap !== null
    },
  )
}
