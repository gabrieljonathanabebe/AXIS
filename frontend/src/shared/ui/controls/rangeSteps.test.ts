import { describe, expect, it } from 'vitest'

import { toStepIndices, toStepRange } from './rangeSteps'

const steps = ['Jan', 'Feb', 'Mar', 'Apr']

describe('toStepIndices', () => {
  it('puts open sides at the ends of the track', () => {
    expect(toStepIndices(steps, null, null)).toEqual([0, 3])
  })

  it('finds the thumbs of a range, an unknown step stays at the end', () => {
    expect(toStepIndices(steps, 'Feb', 'Mar')).toEqual([1, 2])
    expect(toStepIndices(steps, 'Feb', 'Dec')).toEqual([1, 3])
  })
})

describe('toStepRange', () => {
  it('keeps inner steps', () => {
    expect(toStepRange(steps, [1, 2])).toEqual(['Feb', 'Mar'])
  })

  it('leaves a side open at the first or last step', () => {
    expect(toStepRange(steps, [0, 2])).toEqual([null, 'Mar'])
    expect(toStepRange(steps, [0, 3])).toEqual([null, null])
  })
})
