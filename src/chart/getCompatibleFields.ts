import {
  getChartDefinition,
  getSemanticCompatibility,
  type EncodingKey
} from "./chartDefinitions";

import type {
  ChartType,
  DataField,
} from '../types/chart'


export function getCompatibleFields(
  chartType: ChartType,
  encodingKey: EncodingKey,
  fields: DataField[]
): DataField[] {
  const definition = getChartDefinition(chartType)
  return fields.filter((field) => {
    const compatibility = getSemanticCompatibility(
      definition,
      encodingKey,
      field.semantic_type,
    )
    return compatibility !== 'invalid'
  })
}