import type { ColorValue } from '../shared/colorValue'

export type CategoricalColorPalette = {
  label: string
  colors: ColorValue[]
}

/**
 * Default series colors as theme tokens; their values live in
 * `styles/themes.css`. Led by teal so data never looks like the blue
 * accent of selection, brush and format focus. Checked for color blindness
 * on the dark surface.
 */
export const DEFAULT_CATEGORICAL_PALETTE: ColorValue[] = [
  { kind: 'token', token: 'chart1' },
  { kind: 'token', token: 'chart2' },
  { kind: 'token', token: 'chart3' },
  { kind: 'token', token: 'chart4' },
  { kind: 'token', token: 'chart5' },
]

/**
 * Turns hex colors into fixed color values, e.g. of a preset palette.
 * @param colors Hex colors of the palette.
 * @returns One custom color value per hex color.
 */
function createCustomColors(colors: string[]): ColorValue[] {
  return colors.map((color): ColorValue => ({ kind: 'custom', color }))
}

export const categoricalColorPalettes = [
  {
    label: 'Default',
    colors: DEFAULT_CATEGORICAL_PALETTE,
  },
  {
    label: 'Vivid',
    colors: createCustomColors([
      '#2563EB',
      '#DC2626',
      '#16A34A',
      '#D97706',
      '#7C3AED',
    ]),
  },
  {
    label: 'Pastel',
    colors: createCustomColors([
      '#7DD3FC',
      '#C4B5FD',
      '#86EFAC',
      '#FDA4AF',
      '#FDE68A',
    ]),
  },
  {
    label: 'Contrast',
    colors: createCustomColors([
      '#00BCD4',
      '#E91E63',
      '#CDDC39',
      '#FF9800',
      '#3F51B5',
    ]),
  },
] satisfies CategoricalColorPalette[]
