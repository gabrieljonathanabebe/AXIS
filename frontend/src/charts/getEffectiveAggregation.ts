import { AGGREGATION_LABELS } from './aggregations'

import type { Aggregation, ChartDataSpec } from './types'
import type { DataField } from '../datasets/types'

// An aggregated chart with only X set counts the rows per X value.
export function getValueField(data: ChartDataSpec): string | undefined {
  const { x, y } = data.encoding
  return data.aggregation === 'none' ? y : (y ?? x)
}

// Only measures can be summed or averaged; any other field on Y is counted.
export function isCountOnly(data: ChartDataSpec, fields: DataField[]): boolean {
  if (data.aggregation === 'none') {
    return false
  }
  if (!data.encoding.y) {
    return Boolean(data.encoding.x)
  }
  const yField = fields.find((field) => field.name === data.encoding.y)
  return yField !== undefined && yField.semantic_role !== 'measure'
}

export function getEffectiveAggregation(
  data: ChartDataSpec,
  fields: DataField[],
): Aggregation {
  return isCountOnly(data, fields) ? 'count' : data.aggregation
}

/**
 * Names an aggregated value after its aggregation and field.
 * @param field Field the value comes from.
 * @param aggregation Aggregation that is actually applied.
 * @returns E.g. "Sum of profit"; unaggregated values keep the field name.
 */
export function getAggregatedLabel(
  field: string,
  aggregation: Aggregation,
): string {
  return aggregation === 'none'
    ? field
    : `${AGGREGATION_LABELS[aggregation]} of ${field}`
}

// Names the value axis after what is drawn, e.g. "Count of country".
export function getValueLabel(
  data: ChartDataSpec,
  fields: DataField[],
): string | undefined {
  const valueField = getValueField(data)
  if (!valueField) {
    return undefined
  }
  return getAggregatedLabel(valueField, getEffectiveAggregation(data, fields))
}
