import { describe, expect, it } from 'vitest'

import { getScrubValue } from './useScrub'

describe('getScrubValue', () => {
  it('takes one step per distance, rounded to whole steps', () => {
    expect(getScrubValue(10, 13, 6, {})).toBe(12)
    expect(getScrubValue(10, -2, 6, {})).toBe(10)
  })

  it('uses the step and keeps the bounds', () => {
    expect(getScrubValue(0.5, 12, 6, { step: 0.1 })).toBe(0.7)
    expect(getScrubValue(20, 60, 6, { max: 28 })).toBe(28)
  })
})
