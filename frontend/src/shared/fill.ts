import { getPaintCss } from './paint'

import type { Paint, SeriesPaint } from './paint'

// ===== TYPES =================================================================
/**
 * How an area is filled: its paint, solid or a gradient, and the opacity
 * of the whole paint. `TPaint` is a paint with its own color unless the
 * fill takes the color of its series.
 */
export type Fill<TPaint extends Paint | SeriesPaint = Paint> = {
  opacity: number
  paint: TPaint
}

/**
 * Fill of a data series, e.g. the area below a line or scatter points;
 * its color comes from the series.
 */
export type SeriesFill = Fill<SeriesPaint>

// ===== CONSTANTS =============================================================
/** Fill the plus adds on top of a list: a light veil over the fills below. */
const NEW_FILL: Fill = {
  opacity: 0.1,
  paint: { color: { color: '#FFFFFF', kind: 'custom' }, kind: 'solid' },
}

// ===== FUNCTIONS =============================================================
/**
 * Adds a fill on top of the fills of an area, as the first row.
 * @param fills Fills of the canvas or a container, top first.
 * @returns The fills with the new one on top.
 */
export function addFill(fills: Fill[]): Fill[] {
  return [NEW_FILL, ...fills]
}

/**
 * Turns the fills of an area into one CSS background with a layer per
 * fill, the first on top like the rows of its group. CSS has no opacity
 * per layer, so each layer carries it in its colors; a solid fill becomes
 * an even gradient, since only the bottom layer may be a plain color.
 * @param fills Fills of the canvas or a container, top first.
 * @returns A CSS background, or none without fills.
 */
export function getFillsCss(fills: Fill[]): string {
  if (fills.length === 0) {
    return 'none'
  }
  return fills
    .map(({ opacity, paint }) => {
      const css = getPaintCss(paint, opacity)
      return paint.kind === 'solid' ? `linear-gradient(${css}, ${css})` : css
    })
    .join(', ')
}
