import type { ChartTheme } from './chartTheme'
import type { ColorValue } from '../../shared/colorValue'

// ===== FUNCTIONS =============================================================
/**
 * Resolves a color value of the spec into a color ECharts can draw.
 * @param value Color value of one chart element.
 * @param theme Chart theme with the current color of each token.
 * @returns The token's current color or the custom color.
 */
export function resolveColor(value: ColorValue, theme: ChartTheme): string {
  return value.kind === 'token' ? theme.colors[value.token] : value.color
}

/**
 * Resolves a palette of the spec into colors ECharts can draw.
 * @param palette Categorical palette, e.g. of the color scale.
 * @param theme Chart theme with the current color of each token.
 * @returns One color per palette entry.
 */
export function resolvePalette(
  palette: ColorValue[],
  theme: ChartTheme,
): string[] {
  return palette.map((value) => resolveColor(value, theme))
}
