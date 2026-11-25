import { describe, expect, it } from 'vitest'

import { createColorValue } from '@/shared/colorValue'
import {
  getPaletteOptions,
  toPaletteColors,
  toPaletteName,
} from './paletteOptions'

const palettes = [
  { label: 'Vivid', colors: ['#2563EB', '#DC2626'].map(createColorValue) },
  { label: 'Pastel', colors: ['#7DD3FC', '#C4B5FD'].map(createColorValue) },
]

describe('getPaletteOptions', () => {
  it('takes the name as label and value', () => {
    expect(getPaletteOptions(palettes)).toEqual([
      { label: 'Vivid', value: 'Vivid' },
      { label: 'Pastel', value: 'Pastel' },
    ])
  })
})

describe('toPaletteName', () => {
  it('names the palette with the same colors in the same order', () => {
    const colors = ['#7DD3FC', '#C4B5FD'].map(createColorValue)
    expect(toPaletteName(colors, palettes)).toBe('Pastel')
  })

  it('gives no name for changed or reordered colors', () => {
    const reordered = ['#DC2626', '#2563EB'].map(createColorValue)
    const changed = ['#2563EB', '#000000'].map(createColorValue)
    expect(toPaletteName(reordered, palettes)).toBe('')
    expect(toPaletteName(changed, palettes)).toBe('')
  })
})

describe('toPaletteColors', () => {
  it('copies the colors of the palette', () => {
    const colors = toPaletteColors('Vivid', palettes)
    expect(colors).toEqual(palettes[0].colors)
    expect(colors).not.toBe(palettes[0].colors)
  })

  it('finds nothing for an unknown name', () => {
    expect(toPaletteColors('Neon', palettes)).toBeUndefined()
  })
})
