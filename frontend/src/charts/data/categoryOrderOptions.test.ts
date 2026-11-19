import { describe, expect, it } from 'vitest'

import {
  fromLimitChoice,
  fromSortChoice,
  getLimitOptions,
  SORT_OPTIONS,
  toLimitChoice,
  toSortChoice,
} from './categoryOrderOptions'

describe('categoryOrderOptions', () => {
  it.each(SORT_OPTIONS)('turns $label into a sort and back', ({ value }) => {
    expect(toSortChoice(fromSortChoice(value))).toBe(value)
  })

  it('turns a show choice into a limit and back', () => {
    expect(fromLimitChoice('bottom-10')).toEqual({ kind: 'bottom', count: 10 })
    expect(toLimitChoice({ kind: 'bottom', count: 10 })).toBe('bottom-10')
  })

  it('shows all as no limit', () => {
    expect(fromLimitChoice('all')).toBeNull()
    expect(toLimitChoice(null)).toBe('all')
  })

  it('adds a count outside the presets as its own option', () => {
    const labels = getLimitOptions({ kind: 'top', count: 7 }).map((option) => {
      return option.label
    })
    expect(labels).toEqual([
      'All',
      'Top 5',
      'Top 10',
      'Bottom 5',
      'Bottom 10',
      'Top 7',
    ])
  })
})
