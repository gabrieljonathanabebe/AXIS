import { hasFillColor } from '../../shared/fill'

import type { Fill, SeriesFill } from '../../shared/fill'

/** Fill fields of ECharts, e.g. an area style or the item style of points. */
type FillOption = {
  color?: string
  opacity: number
}

// ===== FUNCTION ==============================================================
/**
 * Translates a fill of the spec into ECharts fields; a series fill has no
 * color, the caller sets the series color.
 * @param fill Fill of one chart element, e.g. the area below a line.
 * @returns Color and opacity for ECharts.
 */
export function createFillOption(fill: SeriesFill | Fill): FillOption {
  return {
    color: hasFillColor(fill) ? fill.color : undefined,
    opacity: fill.opacity,
  }
}
