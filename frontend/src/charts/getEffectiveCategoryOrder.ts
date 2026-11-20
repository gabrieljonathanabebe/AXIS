import type { DataField } from '@/datasets/types'
import type { ChartCategoryOrder, ChartDataSpec } from './types'

/**
 * Whether a field holds categories; decided by the physical type, like the
 * chart query that sorts and limits only text and booleans.
 * @param field Field of the dataset.
 * @returns True for text and boolean fields.
 */
export function isCategoryField(field: DataField): boolean {
  return field.physical_type === 'string' || field.physical_type === 'boolean'
}

/**
 * Sort and limit the chart applies to the categories on X.
 * @param data Data spec of the chart.
 * @param fields Fields of the dataset.
 * @returns Sort and limit of the spec, or null if X holds no categories or
 * the chart shows single rows instead of groups.
 */
export function getEffectiveCategoryOrder(
  data: ChartDataSpec,
  fields: DataField[],
): ChartCategoryOrder | null {
  if (data.aggregation === 'none') {
    return null
  }
  const xField = fields.find((field) => field.name === data.encoding.x)
  if (!xField || !isCategoryField(xField)) {
    return null
  }
  return { limit: data.limit, sort: data.sort }
}
