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

/**
 * Key that two equal choices share, e.g. a preset name or `token:text`.
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
