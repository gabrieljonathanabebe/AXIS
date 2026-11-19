import { describe, expect, it } from 'vitest'

import { getEffectiveTimeGrain } from './getEffectiveTimeGrain'

import type { DataField } from '../datasets/types'
import type { ChartDataSpec } from './types'

const fields: DataField[] = [
  {
    name: 'order_date',
    native_grain: 'month',
    physical_type: 'date',
    semantic_role: 'temporal',
  },
  {
    name: 'created_at',
    native_grain: null,
    physical_type: 'datetime',
    semantic_role: 'temporal',
  },
  {
    name: 'period',
    native_grain: null,
    physical_type: 'string',
    semantic_role: 'temporal',
  },
  {
    name: 'start_year',
    native_grain: 'year',
    physical_type: 'date',
    semantic_role: 'dimension',
  },
]

/** Data spec of a sum chart with the given X and changes. */
function createData(
  x: string,
  patch: Partial<ChartDataSpec> = {},
): ChartDataSpec {
  return {
    encoding: { x, y: 'revenue' },
    aggregation: 'sum',
    colorAggregation: 'mean',
    timeGrain: null,
    sort: { by: 'value', order: 'desc' },
    limit: null,
    ...patch,
  }
}

describe('getEffectiveTimeGrain', () => {
  it('takes the native grain of a date field', () => {
    expect(getEffectiveTimeGrain(createData('order_date'), fields)).toBe(
      'month',
    )
  })

  it('falls back to days for a datetime without a native grain', () => {
    expect(getEffectiveTimeGrain(createData('created_at'), fields)).toBe('day')
  })

  it('prefers the chosen grain', () => {
    const data = createData('order_date', { timeGrain: 'quarter' })
    expect(getEffectiveTimeGrain(data, fields)).toBe('quarter')
  })

  it('has no grain for a text field with the temporal role', () => {
    const data = createData('period', { timeGrain: 'year' })
    expect(getEffectiveTimeGrain(data, fields)).toBeNull()
  })

  it('keeps the grain of a date field whose role was overridden', () => {
    expect(getEffectiveTimeGrain(createData('start_year'), fields)).toBe('year')
  })

  it('has no grain for charts of single rows like scatter', () => {
    const data = createData('order_date', { aggregation: 'none' })
    expect(getEffectiveTimeGrain(data, fields)).toBeNull()
  })
})
