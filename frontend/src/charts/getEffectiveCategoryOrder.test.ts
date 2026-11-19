import { describe, expect, it } from 'vitest'

import { getEffectiveCategoryOrder } from './getEffectiveCategoryOrder'

import type { DataField } from '../datasets/types'
import type { ChartDataSpec } from './types'

const fields: DataField[] = [
  {
    name: 'country',
    native_grain: null,
    physical_type: 'string',
    semantic_role: 'dimension',
  },
  {
    name: 'is_result',
    native_grain: null,
    physical_type: 'boolean',
    semantic_role: 'dimension',
  },
  {
    name: 'order_date',
    native_grain: 'month',
    physical_type: 'date',
    semantic_role: 'temporal',
  },
  {
    name: 'year',
    native_grain: null,
    physical_type: 'integer',
    semantic_role: 'dimension',
  },
]

/** Data spec of a sum chart with the given X, top 5 and changes. */
function createData(
  x: string,
  patch: Partial<ChartDataSpec> = {},
): ChartDataSpec {
  return {
    encoding: { x, y: 'revenue' },
    aggregation: 'sum',
    colorAggregation: 'mean',
    timeGrain: null,
    sort: { by: 'category', order: 'asc' },
    limit: { kind: 'top', count: 5 },
    ...patch,
  }
}

describe('getEffectiveCategoryOrder', () => {
  it('takes sort and limit of the spec for a text X', () => {
    expect(getEffectiveCategoryOrder(createData('country'), fields)).toEqual({
      limit: { kind: 'top', count: 5 },
      sort: { by: 'category', order: 'asc' },
    })
  })

  it('treats a boolean X as categories', () => {
    const order = getEffectiveCategoryOrder(createData('is_result'), fields)
    expect(order).not.toBeNull()
  })

  it.each(['order_date', 'year'])('has no order for %s on X', (x) => {
    expect(getEffectiveCategoryOrder(createData(x), fields)).toBeNull()
  })

  it('has no order for charts of single rows like scatter', () => {
    const data = createData('country', { aggregation: 'none' })
    expect(getEffectiveCategoryOrder(data, fields)).toBeNull()
  })
})
