import { hasOwnColor } from '../../shared/paint'
import { createPaintColor, createSeriesPaintColor } from './createPaintColor'

import type { Fill, SeriesFill } from '../../shared/fill'
import type { PaintColor } from './createPaintColor'

/** Fill fields of ECharts, e.g. an area style or the item style of points. */
type FillOption = {
  color?: PaintColor
  opacity: number
}

// ===== FUNCTION ==============================================================
/**
 * Translates a fill of the spec into ECharts fields; a series fill takes
 * the color of its series, solid or as a fade.
 * @param fill Fill of one chart element, e.g. the area below a line.
 * @param seriesColor Resolved color of the series, for a series fill.
 * @returns Color or gradient and opacity for ECharts.
 */
export function createFillOption(
  fill: SeriesFill | Fill,
  seriesColor?: string,
): FillOption {
  return {
    color: hasOwnColor(fill.paint)
      ? createPaintColor(fill.paint)
      : createSeriesPaintColor(fill.paint, seriesColor),
    opacity: fill.opacity,
  }
}
