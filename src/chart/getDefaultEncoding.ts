import type { ChartEncoding, ChartType, Dataset } from '../types/chart'

export function getDefaultEncoding(
  type: ChartType,
  dataset: Dataset,
): ChartEncoding {
  const numberFields = dataset.fields.filter(
    (field) => field.semantic_type === 'numeric',
  )
  const dateField = dataset.fields.find(
    (field) => field.semantic_type === 'temporal',
  )
  const categoryField = dataset.fields.find(
    (field) => field.semantic_type === 'categorical',
  )

  if (type === 'scatter') {
    return {
      x: numberFields[0],
      y: numberFields[1] ?? numberFields[0],
    }
  }
  if (type === 'line') {
    return {
      x: dateField ?? categoryField,
      y: numberFields[0],
    }
  }
  return {
    x: categoryField ?? dateField,
    y: numberFields[0],
  }
}
