import { hasOwnColor } from '../../shared/paint'
import { createPaintColor, createSeriesPaintColor } from './createPaintColor'

import type {
  LineStyle,
  SeriesStrokeStyle,
  StrokeAppearance,
  StrokeStyle,
} from '../../shared/strokeStyle'
import type { PaintColor } from './createPaintColor'

// ===== TYPES =================================================================
/** Border fields of ECharts in the item style of a filled mark. */
type BorderOption = {
  borderColor: PaintColor
  borderType: LineStyle
  borderWidth: number
}

/** Line fields that gridlines and series lines share. */
type StrokeStyleOption = {
  color?: PaintColor
  opacity: number
  type: LineStyle
  width: number
}

// ===== FUNCTIONS =============================================================
/**
 * Translates a border of the spec into ECharts item style fields. Item
 * styles have no border opacity, so the opacity goes into the colors; a
 * hidden border has no width.
 * @param border Border of one mark, e.g. of a bar or a pie segment.
 * @returns Color or gradient with opacity, dash type and width.
 */
export function createBorderOption(border: StrokeAppearance): BorderOption {
  const { stroke, visible } = border
  return {
    borderColor: createPaintColor(stroke.paint, stroke.opacity),
    borderType: stroke.lineStyle,
    borderWidth: visible ? stroke.width : 0,
  }
}

/**
 * Translates a stroke style of the spec into ECharts line fields; a series
 * stroke takes the color of its series, solid or as a fade.
 * @param style Stroke style of one chart element, e.g. gridlines or a line.
 * @param seriesColor Resolved color of the series, for a series stroke.
 * @returns Color or gradient, opacity, dash type and width for ECharts.
 */
export function createStrokeStyleOption(
  style: SeriesStrokeStyle | StrokeStyle,
  seriesColor?: string,
): StrokeStyleOption {
  return {
    color: hasOwnColor(style.paint)
      ? createPaintColor(style.paint)
      : createSeriesPaintColor(style.paint, seriesColor),
    opacity: style.opacity,
    type: style.lineStyle,
    width: style.width,
  }
}
