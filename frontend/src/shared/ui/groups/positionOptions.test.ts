import { describe, expect, it } from 'vitest'

import {
  getPositionOptions,
  toPosition,
  toPositionKey,
} from './positionOptions'

describe('toPositionKey', () => {
  it('keeps the alignment only at top and bottom', () => {
    expect(toPositionKey({ alignment: 'end', side: 'top' })).toBe('top-end')
    expect(toPositionKey({ alignment: 'start', side: 'left' })).toBe('left')
    expect(toPositionKey({ side: 'bottom' })).toBe('bottom')
  })
})

describe('toPosition', () => {
  it('reads side and alignment of a cell', () => {
    expect(toPosition('top-end', true)).toEqual({
      alignment: 'end',
      side: 'top',
    })
  })

  it('centers left and right, and drops the alignment of the cross', () => {
    expect(toPosition('left', true)).toEqual({
      alignment: 'center',
      side: 'left',
    })
    expect(toPosition('top', false)).toEqual({ side: 'top' })
  })
})

describe('getPositionOptions', () => {
  it('leaves the plot empty and offers eight places with an alignment', () => {
    const cells = getPositionOptions(true)
    expect(cells).toHaveLength(9)
    expect(cells[4]).toBeNull()
    expect(cells.filter(Boolean)).toHaveLength(8)
  })

  it('offers only the cross of the four sides without one', () => {
    const values = getPositionOptions(false).map((cell) => cell?.value)
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
