import {
  chartDefinitions,
  getChartDefinition,
  getSemanticCompatibility,
  type EncodingKey,
} from '../chart/chartDefinitions'
import type { CevynAction } from '../types/actions'
import type {
  Aggregation,
  ChartEncoding,
  ChartType,
  Dataset,
} from '../types/chart'
import type { WorkspaceState } from '../types/workspace'

// ===== HELPERS ===============================================================
function validateChartType(chartType: ChartType): string[] {
  return Object.hasOwn(chartDefinitions, chartType)
    ? []
    : [`Unknown chart type "${chartType}".`]
}

function validateEncoding(
  chartType: ChartType,
  encoding: ChartEncoding,
  dataset: Dataset,
): string[] {
  const definition = getChartDefinition(chartType)
  return Object.entries(encoding).flatMap(([encodingKey, fieldName]) => {
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

function validateAggregation(
  chartType: ChartType,
  aggregation: Aggregation,
): string[] {
  const definition = getChartDefinition(chartType)
  return definition.supportedAggregations.includes(aggregation)
    ? []
    : [
        `Aggregation "${aggregation}" is not supported ` +
          `by a ${definition.label} chart.`,
      ]
}

// ===== FUNCTION ==============================================================
export function validateCevynAction(
  action: CevynAction,
  state: WorkspaceState,
  dataset: Dataset,
): string[] {
  if (action.type === 'chart/create') {
    const typeErrors = validateChartType(action.chartType)
    if (typeErrors.length > 0) {
      return typeErrors
    }
    return [
      ...validateEncoding(action.chartType, action.encoding ?? {}, dataset),
      ...(action.aggregation
        ? validateAggregation(action.chartType, action.aggregation)
        : []),
    ]
  }

  const chart = state.charts.find(({ id }) => id === action.chartId)
  if (!chart) {
    return [`Unknown chart "${action.chartId}".`]
  }
  switch (action.type) {
    case 'chart/remove':
    case 'chart/setTitle':
      return []
    case 'chart/setType':
      return validateChartType(action.chartType)
    case 'chart/updateAggregation':
      return validateAggregation(chart.type, action.aggregation)
    case 'chart/updateEncoding':
      return validateEncoding(chart.type, action.encoding, dataset)
  }
}
