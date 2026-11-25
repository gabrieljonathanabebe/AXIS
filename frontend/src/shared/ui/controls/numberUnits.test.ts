import { describe, expect, it } from 'vitest'

import { getShownNumber, toStoredNumber } from './numberUnits'

describe('getShownNumber', () => {
  it('shows a fraction in percent within 0–100', () => {
    expect(getShownNumber(0.4, {}, 'fraction')).toEqual({
      bounds: { max: 100, min: 0, step: 1 },
      value: 40,
    })
  })

  it('drops float noise of stored values and bounds', () => {
    expect(getShownNumber(0.07, {}, 'fraction').value).toBe(7)
    expect(getShownNumber(0.4, { min: 0.05 }, 'fraction').bounds.min).toBe(5)
  })

  it('turns a quarter each way unless the caller sets bounds', () => {
    expect(getShownNumber(30, {}, 'degree').bounds).toEqual({
      max: 90,
      min: -90,
      step: 1,
    })
    expect(getShownNumber(30, { max: 180 }, 'degree').bounds.max).toBe(180)
  })

  it('keeps auto and numbers stored as shown', () => {
    expect(getShownNumber(null, {}, 'px').value).toBeNull()
    expect(getShownNumber(42, {}, 'percent').value).toBe(42)
  })
})

describe('toStoredNumber', () => {
  it('stores a shown percent of a fraction as 0–1', () => {
    expect(toStoredNumber(40, 'fraction')).toBe(0.4)
    expect(toStoredNumber(12, 'px')).toBe(12)
  })
})
