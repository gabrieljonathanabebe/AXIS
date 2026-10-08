import {
  getChartDefinition,
  getSemanticCompatibility,
  type EncodingKey,
} from './chartDefinitions'

import type { ChartType } from './types'
import type { DataField } from '../datasets/types'

export function getCompatibleFields(
  chartType: ChartType,
  encodingKey: EncodingKey,
  fields: DataField[],
): DataField[] {
  const definition = getChartDefinition(chartType)
  return fields.filter((field) => {
    const compatibility = getSemanticCompatibility(
      definition,
      encodingKey,
      field.semantic_role,
    )
    return compatibility !== 'invalid'
  })
}
