import { describe, expect, it } from 'vitest'

import { getPeriodEnd } from './timeGrain'

describe('getPeriodEnd', () => {
  it.each([
    ['day', '2025-03-14', '2025-03-14'],
    ['week', '2025-03-10', '2025-03-16'],
    ['month', '2024-02-01', '2024-02-29'],
    ['quarter', '2025-01-01', '2025-03-31'],
    ['year', '2025-01-01', '2025-12-31'],
  ] as const)('ends a %s starting %s on %s', (grain, start, end) => {
    expect(getPeriodEnd(start, grain)).toBe(end)
  })

  it('returns null for a start that is no date', () => {
    expect(getPeriodEnd('No category', 'month')).toBeNull()
  })
})
