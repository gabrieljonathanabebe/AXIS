import { describe, expect, it } from 'vitest'

import {
  getSelectionQueryFilters,
  matchesSelectionFilter,
} from './dataSelection'

import type { SelectionFilter } from './types'

const emptyCountry: SelectionFilter = {
  kind: 'values',
  field: 'country',
  values: [''],
}

describe('dataSelection, current key of a missing value (#32)', () => {
  it('matches a row without value against an empty text', () => {
    expect(matchesSelectionFilter({ country: null }, emptyCountry)).toBe(true)
  })

  it('cannot tell a missing value from an empty text', () => {
    expect(matchesSelectionFilter({ country: '' }, emptyCountry)).toBe(true)
  })

  it('sends a missing value to the query as the text "null"', () => {
    const filters = getSelectionQueryFilters({
      sourceChartId: 'chart',
      filters: [{ kind: 'values', field: 'country', values: [null] }],
    })
    expect(filters).toEqual([
      { kind: 'values', field: 'country', values: ['null'] },
    ])
  })
})
