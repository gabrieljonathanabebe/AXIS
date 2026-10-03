import {
  chartDefinitions,
  getChartDefinition,
  getSemanticCompatibility,
  type EncodingKey,
} from '../chart/chartDefinitions'
import type { CevynAction } from '../types/actions'
import type { Dataset } from '../types/chart'

// ===== HELPERS ===============================================================
function validateEncoding(action: CevynAction, dataset: Dataset): string[] {
  const definition = getChartDefinition(action.chartType)
  const entries = Object.entries(action.encoding ?? {})
  return entries.flatMap(([encodingKey, fieldName]) => {
    if (fieldName === undefined) {
      return []
    }
    const field = dataset.fields.find(({ name }) => name === fieldName)
    if (!field) {
      return [`Unknown field "${fieldName}".`]
    }
    const compatibility = getSemanticCompatibility(
      definition,
      encodingKey as EncodingKey,
      field.semantic_role,
    )
    return compatibility === 'invalid'
      ? [
          `Field "${fieldName}" cannot be used as "${encodingKey}" ` +
            `in a ${definition.label} chart.`,
        ]
      : []
  })
}

// ===== FUNCTION ==============================================================
export function validateCevynAction(
  action: CevynAction,
  dataset: Dataset,
): string[] {
  if (!Object.hasOwn(chartDefinitions, action.chartType)) {
    return [`Unknown chart type "${action.chartType}".`]
  }
  const definition = getChartDefinition(action.chartType)
  const errors = validateEncoding(action, dataset)
  if (
    action.aggregation &&
    !definition.supportedAggregations.includes(action.aggregation)
  ) {
    errors.push(
      `Aggregation "${action.aggregation}" is not supported ` +
        `by a ${definition.label} chart.`,
    )
  }
  return errors
}
