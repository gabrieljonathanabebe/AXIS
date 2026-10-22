import type { ChartTheme } from './chartTheme'
import type { ColorValue } from '../../shared/colorValue'

// ===== FUNCTION ==============================================================
/**
 * Resolves a color value of the spec into a color ECharts can draw.
 * @param value Color value of one chart element.
 * @param theme Chart theme with the current color of each token.
 * @returns The token's current color or the custom color.
 */
export function resolveColor(value: ColorValue, theme: ChartTheme): string {
  return value.kind === 'token' ? theme.colors[value.token] : value.color
}
