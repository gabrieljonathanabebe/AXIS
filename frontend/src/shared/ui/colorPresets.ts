import { createContext } from 'react'

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

// ===== CONSTANTS =============================================================
/**
 * Swatches every color picker shows in front of its own, e.g. the colors
 * of the dashboard style; empty outside a provider.
 */
export const SharedColorPresets = createContext<ColorPreset[]>([])

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

/**
 * Joins the shared swatches and those of a place, the shared ones first;
 * a color that is already there drops out, so no swatch shows twice.
 * @param shared Swatches of every picker, e.g. the style colors.
 * @param local Swatches of the place.
 * @returns One list without repeated colors.
 */
export function joinColorPresets<TPreset extends string = never>(
  shared: ColorPreset<TPreset>[],
  local: ColorPreset<TPreset>[],
): ColorPreset<TPreset>[] {
  const seenKeys = new Set<string>()
  return [...shared, ...local].filter((preset) => {
    const key = getChoiceKey(preset.value)
    if (seenKeys.has(key)) {
      return false
    }
    seenKeys.add(key)
    return true
  })
}
