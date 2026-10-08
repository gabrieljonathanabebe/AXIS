import type {
  ContinuousVisualMapComponentOption,
  VisualMapComponentOption,
} from 'echarts'

import { createContinuousColorVisualMap } from './createContinuousColorVisualMap'
import { getNumericDomain } from './getNumericDomain'

import type { ColorEncodingMode } from '../getColorEncodingMode'

import type {
  ChartAppearanceSpec,
  ChartEncoding,
  DataRow,
} from '../../types/chart'

type CreateScatterVisualMapsParams = {
  rows: DataRow[]
  encoding: ChartEncoding
  appearance: ChartAppearanceSpec
  colorEncodingMode: ColorEncodingMode
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

function createColorVisualMap(
  rows: DataRow[],
  encoding: ChartEncoding,
  appearance: ChartAppearanceSpec,
  colorEncodingMode: ColorEncodingMode,
): VisualMapComponentOption | null {
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

export function createScatterVisualMaps({
  rows,
  encoding,
  appearance,
  colorEncodingMode,
}: CreateScatterVisualMapsParams): VisualMapComponentOption[] {
  const visualMaps = [
    createSizeVisualMap(rows, encoding, appearance),
    createColorVisualMap(rows, encoding, appearance, colorEncodingMode),
  ]

  return visualMaps.filter(
    (visualMap): visualMap is VisualMapComponentOption => {
      return visualMap !== null
    },
  )
}
