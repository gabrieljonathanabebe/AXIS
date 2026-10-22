// ===== TYPES =================================================================
/**
 * Named color of the theme; a value with a token follows theme and
 * branding instead of keeping a fixed color.
 */
export type ColorToken =
  'accent' | 'border' | 'gridLine' | 'inactive' | 'text' | 'textMuted'

/**
 * Color of a formatted element: a theme token or a fixed custom color.
 * Conditional colors become a further kind without changing these.
 */
export type ColorValue =
  { kind: 'custom'; color: string } | { kind: 'token'; token: ColorToken }

// ===== CONSTANTS =============================================================
/** CSS variable that holds each token, read by HTML and the chart theme. */
export const COLOR_TOKEN_VARIABLES = {
  accent: '--color-accent',
  border: '--chart-border',
  gridLine: '--chart-grid-line',
  inactive: '--chart-inactive',
  text: '--color-text-primary',
  textMuted: '--color-text-secondary',
} satisfies Record<ColorToken, string>

// ===== FUNCTIONS =============================================================
/**
 * Turns a color value into CSS for elements rendered as HTML.
 * @param value Color value, e.g. of a title.
 * @returns The token's CSS variable or the custom color.
 */
export function getColorCss(value: ColorValue): string {
  return value.kind === 'token'
    ? `var(${COLOR_TOKEN_VARIABLES[value.token]})`
    : value.color
}
