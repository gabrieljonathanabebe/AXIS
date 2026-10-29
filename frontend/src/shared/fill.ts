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
