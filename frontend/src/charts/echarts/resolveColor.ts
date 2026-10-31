import { color } from 'echarts'

import type { ColorValue } from '../../shared/colorValue'

// ===== CONSTANTS =============================================================
/**
 * Brightness shift per round through a categorical palette: the first round
 * is the palette itself, later rounds lighten (positive) or darken
 * (negative) the same colors. After the last round the shifts repeat.
 */
const PALETTE_ROUND_SHIFTS = [0, 0.4, -0.35, 0.65, -0.55]

// ===== FUNCTIONS =============================================================
/**
 * Resolves a color value of the spec into a color ECharts can draw;
 * conditional colors will add their case here.
 * @param value Color value of one chart element.
 * @returns The custom color.
 */
export function resolveColor(value: ColorValue): string {
  return value.color
}

/**
 * Resolves a palette of the spec into colors ECharts can draw.
 * @param palette Categorical palette, e.g. of the color scale.
 * @returns One color per palette entry.
 */
export function resolvePalette(palette: ColorValue[]): string[] {
  return palette.map(resolveColor)
}

/**
 * Picks the color of one category from a palette and extends the palette
 * stably: the first round keeps its colors, every further round shifts
 * them lighter or darker, so adding a category never recolors the others.
 * @param palette Resolved colors of a categorical palette.
 * @param index Position of the category, e.g. of a series or pie segment.
 * @returns The palette color of the category's round.
 */
export function getPaletteColor(palette: string[], index: number): string {
  const baseColor = palette[index % palette.length]
  const round = Math.floor(index / palette.length)
  const shift = PALETTE_ROUND_SHIFTS[round % PALETTE_ROUND_SHIFTS.length]
  if (shift > 0) {
    return color.lift(baseColor, shift)
  }
  if (shift < 0) {
    return color.lerp(-shift, [baseColor, '#000000'])
  }
  return baseColor
}
