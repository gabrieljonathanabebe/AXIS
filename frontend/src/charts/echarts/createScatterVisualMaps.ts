import { createContinuousColorVisualMap } from './createContinuousColorVisualMap'

import type { VisualMapComponentOption } from 'echarts'
import type { DataRow } from '../../datasets/types'
import type { ColorEncodingMode } from '../getColorEncodingMode'
import type { ChartAppearanceSpec, ChartEncoding } from '../types'

type CreateScatterVisualMapsParams = {
  rows: DataRow[]
  encoding: ChartEncoding
  appearance: ChartAppearanceSpec
  colorEncodingMode: ColorEncodingMode
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
    values,
  })
}

/**
 * Creates the color scale of a scatter chart; point sizes come from the
 * series, so they stay true to area.
 * @param params Points, fields and appearance of the chart.
 * @returns Visual maps that apply to the chart.
 */
export function createScatterVisualMaps(
  params: CreateScatterVisualMapsParams,
): VisualMapComponentOption[] {
  const colorVisualMap = createColorVisualMap(params)
  return colorVisualMap ? [colorVisualMap] : []
}
