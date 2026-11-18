import { afterEach, describe, expect, it, vi } from 'vitest'

import { createDateFormatter, formatDate, parseDateValue } from './formatDate'
import { DEFAULT_DATE_FORMAT } from './valueFormats'

import type { DateFormat, DatePreset, TimeGrain } from './valueFormats'

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

describe('date presets', () => {
  it.each<[DatePreset, TimeGrain, string, string, string]>([
    ['day-medium', 'day', '2025-03-14', 'Mar 14, 2025', '14. März 2025'],
    ['day-numeric', 'day', '2025-03-14', '03/14/2025', '14.03.2025'],
    ['day-iso', 'day', '2025-03-14', '2025-03-14', '2025-03-14'],
    ['day-weekday', 'day', '2025-03-14', 'Fri, Mar 14', 'Fr., 14. März'],
    ['week-start', 'week', '2025-03-10', 'Mar 10, 2025', '10. März 2025'],
    ['week-number', 'week', '2025-03-10', 'W11 2025', 'W11 2025'],
    ['month-short', 'month', '2025-03-01', 'Mar 2025', 'März 2025'],
    ['month-long', 'month', '2025-03-01', 'March 2025', 'März 2025'],
    ['month-numeric', 'month', '2025-03-01', '03/2025', '03/2025'],
    ['month-iso', 'month', '2025-03-01', '2025-03', '2025-03'],
    ['quarter', 'quarter', '2025-01-01', 'Q1 2025', 'Q1 2025'],
    ['quarter-short', 'quarter', '2025-01-01', "Q1 '25", "Q1 '25"],
    ['year', 'year', '2025-01-01', '2025', '2025'],
    ['year-short', 'year', '2025-01-01', "'25", "'25"],
  ])('writes %s', (preset, grain, value, en, de) => {
    const format: DateFormat = { style: 'preset', preset }
    expect(createDateFormatter(format, grain)(value)).toBe(en)
    expect(createDateFormatter(format, grain, 'de')(value)).toBe(de)
  })

  it('numbers ISO weeks across the turn of the year', () => {
    const format: DateFormat = { style: 'preset', preset: 'week-number' }
    expect(createDateFormatter(format, 'week')('2024-12-30')).toBe('W1 2025')
    expect(createDateFormatter(format, 'week')('2026-12-28')).toBe('W53 2026')
  })

  it('falls back to auto when the preset does not fit the grain', () => {
    const format: DateFormat = { style: 'preset', preset: 'month-long' }
    expect(createDateFormatter(format, 'quarter')('2025-01-01')).toBe('Q1 2025')
  })
})
