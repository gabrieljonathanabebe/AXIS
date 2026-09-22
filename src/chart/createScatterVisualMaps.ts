import type {
  ContinuousVisualMapComponentOption,
  VisualMapComponentOption,
} from 'echarts'

import { createContinuousColorVisualMap } from './createContinuousColorVisualMap'

import type {
  ChartAppearanceSpec,
  ChartEncoding,
  Dataset,
} from '../types/chart'

type NumericDomain = {
  min: number
  max: number
}

type CreateScatterVisualMapsParams = {
  rows: Dataset['rows']
  encoding: ChartEncoding
  appearance: ChartAppearanceSpec
}

function getNumericDomain(
  rows: Dataset['rows'],
  fieldName: string,
): NumericDomain | null {
  const values = rows.flatMap((row) => {
    const value = row[fieldName]

    return typeof value === 'number' && Number.isFinite(value) ? [value] : []
  })

  if (values.length === 0) {
    return null
  }

  const min = Math.min(...values)
  const max = Math.max(...values)

  return {
    min,
    max: min === max ? min + 1 : max,
  }
}

function createSizeVisualMap(
  rows: Dataset['rows'],
  encoding: ChartEncoding,
  appearance: ChartAppearanceSpec,
): ContinuousVisualMapComponentOption | null {
  const fieldName = encoding.size?.name

  if (!fieldName) {
    return null
  }

  const domain = getNumericDomain(rows, fieldName)

  if (!domain) {
    return null
  }

  return {
    show: false,
    type: 'continuous',
    dimension: 2,
    min: domain.min,
    max: domain.max,
    inRange: {
      symbolSize: [
        appearance.scatter.sizeRange.min,
        appearance.scatter.sizeRange.max,
      ],
    },
  }
}

function createColorVisualMap(
  rows: Dataset['rows'],
  encoding: ChartEncoding,
  appearance: ChartAppearanceSpec,
): VisualMapComponentOption | null {
  const colorField = encoding.color
  if (colorField?.semantic_type !== 'numeric') {
    return null
  }
  const values = rows.map((row) => {
    const value = row[colorField.name]
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
}: CreateScatterVisualMapsParams): VisualMapComponentOption[] {
  const visualMaps = [
    createSizeVisualMap(rows, encoding, appearance),
    createColorVisualMap(rows, encoding, appearance),
  ]

  return visualMaps.filter(
    (visualMap): visualMap is VisualMapComponentOption => {
      return visualMap !== null
    },
  )
}
