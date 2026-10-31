import { getColorCss, getColorValueKey } from '../colorValue'

import type { ColorValue } from '../colorValue'

// ===== TYPES =================================================================
/**
 * Swatch of a color picker. A preset that is no color, e.g. the glass
 * background, carries its own name as value and shows `fill`.
 */
export type ColorPreset<TPreset extends string = never> = {
  fill?: string
  label: string
  value: ColorValue | TPreset
}

// ===== FUNCTIONS =============================================================
/**
 * Key that two equal choices share, e.g. a preset name or `#1E90FF`.
 * @param value Color or preset name.
 * @returns Preset name or key of the color value.
 */
export function getChoiceKey(value: ColorValue | string): string {
  return typeof value === 'string' ? value : getColorValueKey(value)
}

/**
 * Color a swatch shows; a named preset shows the accent behind its fill.
 * @param value Color or preset name.
 * @returns CSS color of the swatch.
 */
export function getSwatchColor(value: ColorValue | string): string {
  return typeof value === 'string' ? 'var(--color-accent)' : getColorCss(value)
}
