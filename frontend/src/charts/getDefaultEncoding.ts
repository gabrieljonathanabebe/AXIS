import type { ChartEncoding, ChartType } from './types'
import type { Dataset } from '../datasets/types'

export function getDefaultEncoding(
  type: ChartType,
  dataset: Dataset,
): ChartEncoding {
  const measureNames = dataset.fields
    .filter((field) => field.semantic_role === 'measure')
    .map((field) => field.name)
  const temporalName = dataset.fields.find(
    (field) => field.semantic_role === 'temporal',
  )?.name
  const dimensionName = dataset.fields.find(
    (field) => field.semantic_role === 'dimension',
  )?.name

  if (type === 'scatter') {
    return {
      x: measureNames[0],
      y: measureNames[1] ?? measureNames[0],
    }
  }
  if (type === 'line') {
    return {
      x: temporalName ?? dimensionName,
      y: measureNames[0],
    }
  }
  return {
    x: dimensionName ?? temporalName,
    y: measureNames[0],
  }
}
