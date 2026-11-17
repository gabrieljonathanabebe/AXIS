import { afterEach, describe, expect, it, vi } from 'vitest'

import { createDateFormatter, formatDate, parseDateValue } from './formatDate'
import { DEFAULT_DATE_FORMAT } from './valueFormats'

import type { TimeGrain } from './valueFormats'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('parseDateValue', () => {
  it('keeps the day as written in any time zone (#34)', () => {
    for (const zone of ['Europe/Berlin', 'America/New_York']) {
      vi.stubEnv('TZ', zone)
      expect(formatDate('2025-03-01T00:30:00')).toBe('Mar 1, 2025')
      expect(formatDate('2025-03-01T23:30:00')).toBe('Mar 1, 2025')
      expect(formatDate('2025-03-01')).toBe('Mar 1, 2025')
    }
  })

  it('returns null for values that are no date', () => {
    expect(parseDateValue('n/a')).toBeNull()
    expect(parseDateValue('2025-02-30')).toBeNull()
    expect(parseDateValue(Number.NaN)).toBeNull()
  })

  it('reads timestamps', () => {
    expect(formatDate(Date.UTC(2025, 2, 14))).toBe('Mar 14, 2025')
  })
})

describe('createDateFormatter', () => {
  it.each<[TimeGrain, string, string, string]>([
    ['day', '2025-03-14', 'Mar 14, 2025', '14. März 2025'],
    ['week', '2025-03-10', 'Mar 10, 2025', '10. März 2025'],
    ['month', '2025-03-01', 'Mar 2025', 'März 2025'],
    ['quarter', '2025-01-01', 'Q1 2025', 'Q1 2025'],
    ['year', '2025-01-01', '2025', '2025'],
  ])('formats %s in English and German', (grain, value, en, de) => {
    expect(createDateFormatter(DEFAULT_DATE_FORMAT, grain)(value)).toBe(en)
    expect(createDateFormatter(DEFAULT_DATE_FORMAT, grain, 'de')(value)).toBe(
      de,
    )
  })

  it('puts the edge months into the right quarter', () => {
    const format = createDateFormatter(DEFAULT_DATE_FORMAT, 'quarter')
    expect(format('2025-03-31')).toBe('Q1 2025')
    expect(format('2025-04-01')).toBe('Q2 2025')
    expect(format('2025-09-30')).toBe('Q3 2025')
    expect(format('2025-12-31')).toBe('Q4 2025')
  })

  it('shows days without a grain and text that is no date as is', () => {
    const format = createDateFormatter(DEFAULT_DATE_FORMAT, null)
    expect(format('2025-03-14T08:00:00')).toBe('Mar 14, 2025')
    expect(format('unknown')).toBe('unknown')
  })
})
