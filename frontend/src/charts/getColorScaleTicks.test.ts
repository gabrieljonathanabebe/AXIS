import { describe, expect, it } from 'vitest'

import { getColorScaleTicks } from './getColorScaleTicks'

describe('getColorScaleTicks', () => {
  it('shows only minimum and maximum when automatic', () => {
    expect(getColorScaleTicks({ max: 90, min: 5 }, null)).toEqual([5, 90])
  })

  it('takes round steps for a tick count', () => {
    expect(getColorScaleTicks({ max: 100, min: 0 }, 4)).toEqual([
      0, 25, 50, 75, 100,
    ])
    expect(getColorScaleTicks({ max: 60, min: -40 }, 5)).toEqual([
      -40, -20, 0, 20, 40, 60,
    ])
  })

  it('keeps ticks inside the range', () => {
    expect(getColorScaleTicks({ max: 97, min: 3 }, 4)).toEqual([25, 50, 75])
  })

  it('never gives more sections than wanted', () => {
    expect(getColorScaleTicks({ max: 100, min: 0 }, 3)).toEqual([0, 50, 100])
  })

  it('rounds away floating point errors', () => {
    expect(getColorScaleTicks({ max: 0.3, min: 0 }, 3)).toEqual([
      0, 0.1, 0.2, 0.3,
    ])
  })

  it('shows one value for an empty range', () => {
    expect(getColorScaleTicks({ max: 12, min: 12 }, 4)).toEqual([12])
  })
})
