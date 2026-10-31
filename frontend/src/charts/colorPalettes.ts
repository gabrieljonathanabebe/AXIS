import { createColorValue } from '../shared/colorValue'

import type { DashboardStyle } from '../dashboardStyle/types'
import type { ColorValue } from '../shared/colorValue'

export type CategoricalColorPalette = {
  label: string
  colors: ColorValue[]
}

/**
 * Turns hex colors into fixed color values, e.g. of a preset palette.
 * @param colors Hex colors of the palette.
 * @returns One custom color value per hex color.
 */
function createCustomColors(colors: string[]): ColorValue[] {
  return colors.map(createColorValue)
}

/** Fixed palettes the palette control offers after the style palette. */
const presetPalettes = [
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

/**
 * Palettes of the palette control: first the palette of the current style,
 * then the fixed presets. Picking one writes its colors as fixed values.
 * @param style Current dashboard style.
 * @returns Style palette and presets.
 */
export function getCategoricalPalettes(
  style: DashboardStyle,
): CategoricalColorPalette[] {
  return [
    { colors: style.palette.map(createColorValue), label: 'Style' },
    ...presetPalettes,
  ]
}
