import { describe, expect, it } from 'vitest'

import { createHighlightQuery } from './createChartQuery'

import type { DataSelection } from '../workspace/types'
import type { ChartQueryRequest, ChartQueryResult } from './chartsApi'

const selection: DataSelection = {
  sourceChartId: 'other-chart',
  filters: [{ kind: 'values', field: 'category', values: ['Hardware'] }],
}

/** Base query of a revenue chart by country, top 2, with changes. */
function createQuery(
  patch: Partial<ChartQueryRequest> = {},
): ChartQueryRequest {
  return {
    aggregation: 'sum',
    categories: null,
    color: null,
    color_aggregation: null,
    filters: [],
    limit: { kind: 'top', count: 2 },
    series: 'segment',
    sort: { by: 'value', order: 'desc' },
    time_grain: null,
    x: 'country',
    y: 'revenue',
    ...patch,
  }
}

/** Result with two series per country, largest country first. */
const result: ChartQueryResult = {
  points: [
    { color_value: null, series: 'A', value: 30, x: 'US' },
    { color_value: null, series: 'B', value: 20, x: 'US' },
    { color_value: null, series: 'A', value: 25, x: null },
  ],
}

describe('createHighlightQuery', () => {
  it('takes the categories of the base result instead of sort and limit', () => {
    expect(createHighlightQuery(createQuery(), selection, result)).toEqual(
      createQuery({
        categories: ['US', null],
        filters: [{ kind: 'values', field: 'category', values: ['Hardware'] }],
        limit: null,
        sort: null,
      }),
    )
  })

  it('waits for the base result with categories on X', () => {
    expect(createHighlightQuery(createQuery(), selection, null)).toBeNull()
  })

  it('keeps a date X without waiting for the base result', () => {
    const query = createQuery({ limit: null, sort: null, time_grain: 'month' })
    expect(createHighlightQuery(query, selection, null)?.categories).toBeNull()
  })

  it('has no highlight without a selection', () => {
    expect(createHighlightQuery(createQuery(), null, result)).toBeNull()
  })

  it('currently skips the base result for a text X without sort (E1)', () => {
    const query = createQuery({ limit: null, sort: null })
    expect(createHighlightQuery(query, selection, null)?.categories).toBeNull()
  })

  it('currently waits for the base result for a date X with sort (E1)', () => {
    const query = createQuery({ time_grain: 'month', x: 'order_date' })
    expect(createHighlightQuery(query, selection, null)).toBeNull()
  })
})
