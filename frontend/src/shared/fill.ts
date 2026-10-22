// ===== TYPES =================================================================
/**
 * How an area is filled, e.g. below a line. Only solid exists for now;
 * gradients or patterns become further kinds without changing this one.
 */
export type Fill = {
  color: string
  kind: 'solid'
  opacity: number
}

/**
 * Fill of a data series, e.g. scatter points; its color comes from the
 * series.
 */
export type SeriesFill = Omit<Fill, 'color'>

// ===== FUNCTIONS =============================================================
/**
 * Tells a fill with its own color from a series fill.
 * @param fill Fill, e.g. of a line area or of scatter points.
 * @returns True when the fill carries a color.
 */
export function hasFillColor(fill: SeriesFill): fill is Fill {
  return 'color' in fill
}
