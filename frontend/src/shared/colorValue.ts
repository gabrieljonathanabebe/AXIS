// ===== TYPES =================================================================
/**
 * Color of a formatted element: a fixed hex color. Conditional colors
 * become a further kind without changing this one.
 */
export type ColorValue = { color: string; kind: 'custom' }

// ===== FUNCTIONS =============================================================
/**
 * Wraps a hex color into a color value of the spec, e.g. a style color.
 * @param color Hex color.
 * @returns A fixed custom color.
 */
export function createColorValue(color: string): ColorValue {
  return { color, kind: 'custom' }
}

/**
 * Turns a color value into CSS for elements rendered as HTML; below full
 * opacity the color is mixed with transparent, e.g. a shadow at 25 %.
 * @param value Color value, e.g. of a title.
 * @param opacity Opacity of the color, from 0 to 1.
 * @returns The color, mixed with transparent below full opacity.
 */
export function getColorCss(value: ColorValue, opacity = 1): string {
  return opacity < 1
    ? `color-mix(in srgb, ${value.color} ${opacity * 100}%, transparent)`
    : value.color
}

/**
 * Brings a hex color into one spelling, e.g. `1e90ff` to `#1E90FF`.
 * @param value Hex color, with or without `#`.
 * @returns Uppercase hex color with `#`.
 */
export function normalizeHex(value: string): string {
  const trimmedValue = value.trim()
  const prefixedValue = trimmedValue.startsWith('#')
    ? trimmedValue
    : `#${trimmedValue}`

  return prefixedValue.toUpperCase()
}

/**
 * Key that two equal color values share, e.g. `#1E90FF`.
 * @param value Color value, e.g. of a palette entry.
 * @returns Normalized hex color.
 */
export function getColorValueKey(value: ColorValue): string {
  return normalizeHex(value.color)
}
