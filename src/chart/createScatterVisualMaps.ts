import type {
  ContinuousVisualMapComponentOption,
  PiecewiseVisualMapComponentOption,
  VisualMapComponentOption,
} from 'echarts'

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

function createContinuousColorVisualMap(
  rows: Dataset['rows'],
  fieldName: string,
  appearance: ChartAppearanceSpec,
): ContinuousVisualMapComponentOption | null {
  const domain = getNumericDomain(rows, fieldName)

  if (!domain) {
    return null
  }

  return {
    show: false,
    type: 'continuous',
    dimension: 3,
    min: domain.min,
    max: domain.max,
    inRange: {
      color: [
        appearance.colorScale.continuous.startColor,
        appearance.colorScale.continuous.endColor,
      ],
    },
  }
}

function createCategoricalColorVisualMap(
  rows: Dataset['rows'],
  fieldName: string,
  appearance: ChartAppearanceSpec,
): PiecewiseVisualMapComponentOption | null {
  const categories = Array.from(
    new Set(
      rows.flatMap((row) => {
        const value = row[fieldName]

        return value === null || value === undefined ? [] : [String(value)]
      }),
    ),
  )

  if (categories.length === 0) {
    return null
  }

  return {
    show: false,
    type: 'piecewise',
    dimension: 3,
    categories,
    inRange: {
      color: appearance.colorScale.categorical.palette,
    },
  }
}

function createColorVisualMap(
  rows: Dataset['rows'],
  encoding: ChartEncoding,
  appearance: ChartAppearanceSpec,
): VisualMapComponentOption | null {
  const colorField = encoding.color

  if (!colorField) {
    return null
  }

  if (colorField.semantic_type === 'numeric') {
    return createContinuousColorVisualMap(rows, colorField.name, appearance)
  }

  return createCategoricalColorVisualMap(rows, colorField.name, appearance)
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
