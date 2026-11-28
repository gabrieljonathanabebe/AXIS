import { describe, expect, it } from 'vitest'

import {
  getPlacementOptions,
  toPlacement,
  toPlacementKey,
} from './placementOptions'

describe('toPlacementKey', () => {
  it('keeps the alignment only at top and bottom', () => {
    expect(toPlacementKey({ alignment: 'end', side: 'top' })).toBe('top-end')
    expect(toPlacementKey({ alignment: 'start', side: 'left' })).toBe('left')
    expect(toPlacementKey({ side: 'bottom' })).toBe('bottom')
  })
})

describe('toPlacement', () => {
  it('reads side and alignment of a cell', () => {
    expect(toPlacement('top-end', true)).toEqual({
      alignment: 'end',
      side: 'top',
    })
  })

  it('centers left and right, and drops the alignment of the cross', () => {
    expect(toPlacement('left', true)).toEqual({
      alignment: 'center',
      side: 'left',
    })
    expect(toPlacement('top', false)).toEqual({ side: 'top' })
  })
})

describe('getPlacementOptions', () => {
  it('leaves the plot empty and offers eight places with an alignment', () => {
    const cells = getPlacementOptions(true)
    expect(cells).toHaveLength(9)
    expect(cells[4]).toBeNull()
    expect(cells.filter(Boolean)).toHaveLength(8)
  })

  it('offers only the cross of the four sides without one', () => {
    const values = getPlacementOptions(false).map((cell) => cell?.value)
    expect(values).toEqual([
      undefined,
      'top',
      undefined,
      'left',
      undefined,
      'right',
      undefined,
      'bottom',
      undefined,
    ])
  })
})
