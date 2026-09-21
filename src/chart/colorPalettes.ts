export type CategoricalColorPalette = {
  label: string
  colors: string[]
}

export const DEFAULT_CATEGORICAL_PALETTE = [
  '#1E90FF',
  '#8B5CF6',
  '#34D399',
  '#FB7185',
  '#F59E0B',
]

export const categoricalColorPalettes = [
  {
    label: 'Electric',
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
