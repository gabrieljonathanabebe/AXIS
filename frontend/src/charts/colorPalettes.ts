export type CategoricalColorPalette = {
  label: string
  colors: string[]
}

/**
 * Default series colors, led by teal so data never looks like the blue
 * accent of selection, brush and format focus. Checked for color blindness
 * on the dark surface.
 */
export const DEFAULT_CATEGORICAL_PALETTE = [
  '#199E8A',
  '#D95926',
  '#8F80EC',
  '#C98500',
  '#D55181',
]

export const categoricalColorPalettes = [
  {
    label: 'Default',
    colors: DEFAULT_CATEGORICAL_PALETTE,
  },
  {
    label: 'Vivid',
    colors: ['#2563EB', '#DC2626', '#16A34A', '#D97706', '#7C3AED'],
  },
  {
    label: 'Pastel',
    colors: ['#7DD3FC', '#C4B5FD', '#86EFAC', '#FDA4AF', '#FDE68A'],
  },
  {
    label: 'Contrast',
    colors: ['#00BCD4', '#E91E63', '#CDDC39', '#FF9800', '#3F51B5'],
  },
] satisfies CategoricalColorPalette[]
