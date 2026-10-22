import { getColorValueKey } from '../colorValue'

import type { ColorPreset } from './ColorControl'
import type { ColorValue } from '../colorValue'

// ===== CONSTANTS =============================================================
/** Theme colors a text or line offers next to its own default. */
const STYLE_COLOR_PRESETS: ColorPreset[] = [
  { label: 'Muted', value: { kind: 'token', token: 'textMuted' } },
  { label: 'Accent', value: { kind: 'token', token: 'accent' } },
]

/** Data colors of marks, e.g. bars, areas and points; Chart 1 is default. */
export const DATA_COLOR_PRESETS: ColorPreset[] = [
  { label: 'Chart 1', value: { kind: 'token', token: 'chart1' } },
  { label: 'Chart 2', value: { kind: 'token', token: 'chart2' } },
  { label: 'Chart 3', value: { kind: 'token', token: 'chart3' } },
  { label: 'Chart 4', value: { kind: 'token', token: 'chart4' } },
  { label: 'Chart 5', value: { kind: 'token', token: 'chart5' } },
]

// ===== FUNCTIONS =============================================================
/**
 * Swatches of a text or line: its default first, then Muted and Accent
 * unless one of them is the default.
 * @param defaultColor Color the element gets when created, e.g. `gridLine`.
 * @returns Presets for the color control.
 */
export function createStyleColorPresets(
  defaultColor: ColorValue,
): ColorPreset[] {
  const defaultKey = getColorValueKey(defaultColor)
  return [
    { label: 'Default', value: defaultColor },
    ...STYLE_COLOR_PRESETS.filter((preset) => {
      return getColorValueKey(preset.value) !== defaultKey
    }),
  ]
}
