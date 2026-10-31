// ===== TYPES =================================================================
/**
 * Named color of the theme; a value with a token follows theme and
 * branding instead of keeping a fixed color. `chart1`–`chart5` are the
 * data colors of series and marks, `accent` is the accent of the dashboard,
 * not of the editor.
 */
export type ColorToken =
  | 'accent'
  | 'border'
  | 'chart1'
  | 'chart2'
  | 'chart3'
  | 'chart4'
  | 'chart5'
  | 'gridLine'
  | 'inactive'
  | 'text'
  | 'textMuted'

/**
 * Color of a formatted element: a theme token or a fixed custom color.
 * Conditional colors become a further kind without changing these.
 */
export type ColorValue =
  { kind: 'custom'; color: string } | { kind: 'token'; token: ColorToken }

// ===== CONSTANTS =============================================================
/** CSS variable that holds each token, read by HTML and the chart theme. */
export const COLOR_TOKEN_VARIABLES = {
  accent: '--dashboard-accent',
  border: '--chart-border',
  chart1: '--chart-1',
  chart2: '--chart-2',
  chart3: '--chart-3',
  chart4: '--chart-4',
  chart5: '--chart-5',
  gridLine: '--chart-grid-line',
  inactive: '--chart-inactive',
  text: '--color-text-primary',
  textMuted: '--color-text-secondary',
} satisfies Record<ColorToken, string>

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
 * @returns The token's CSS variable or the custom color, mixed with
 *   transparent below full opacity.
 */
export function getColorCss(value: ColorValue, opacity = 1): string {
  const color =
    value.kind === 'token'
      ? `var(${COLOR_TOKEN_VARIABLES[value.token]})`
      : value.color
  return opacity < 1
    ? `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`
    : color
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
 * Key that two equal color values share, e.g. `token:text` or `#1E90FF`.
 * @param value Color value, e.g. of a palette entry.
 * @returns Token key or normalized hex color.
 */
export function getColorValueKey(value: ColorValue): string {
  return value.kind === 'token'
    ? `token:${value.token}`
    : normalizeHex(value.color)
}
