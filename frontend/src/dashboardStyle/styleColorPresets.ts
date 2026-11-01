import { createColorValue } from '../shared/colorValue'

import type { ColorPreset } from '../shared/ui/colorPresets'
import type { DashboardStyle } from './types'

/**
 * Swatches of the style colors that every color picker offers first:
 * text, muted text, accent and the data colors. Picking one writes the
 * plain value; nothing stays linked to the style.
 * @param style Current dashboard style.
 * @returns Swatches in the order of the picker.
 */
export function createStyleColorPresets(style: DashboardStyle): ColorPreset[] {
  return [
    { label: 'Text', value: createColorValue(style.colors.text) },
    { label: 'Muted', value: createColorValue(style.colors.textMuted) },
    { label: 'Accent', value: createColorValue(style.colors.accent) },
    ...style.palette.map((color, index): ColorPreset => {
      return { label: `Data ${index + 1}`, value: createColorValue(color) }
    }),
  ]
}
