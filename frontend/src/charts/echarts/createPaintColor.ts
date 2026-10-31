import { color } from 'echarts'

import {
  DEFAULT_RADIAL_SHAPE,
  getLinearGradientPoints,
} from '../../shared/paint'
import { resolveColor } from './resolveColor'

import type { LinearGradientObject, RadialGradientObject } from 'echarts'
import type {
  GradientType,
  Paint,
  RadialShape,
  SeriesPaint,
} from '../../shared/paint'

// ===== TYPES =================================================================
/** Color ECharts paints a shape with: one color or a gradient. */
export type PaintColor = string | LinearGradientObject | RadialGradientObject

/** Resolved colors of a gradient with their offsets, for ECharts. */
type ColorStops = LinearGradientObject['colorStops']

// ===== HELPERS ===============================================================
/**
 * Builds a gradient that ECharts draws inside the bounds of each shape,
 * e.g. of every bar. A radial one is a circle around its center, its
 * radius relative to the shorter side, since ECharts knows no ellipses;
 * a fade has no shape of its own and runs from the center.
 * @param course Type and angle of the gradient or fade.
 * @param colorStops Resolved colors with their offsets.
 * @param shape Center and radius of a radial gradient.
 * @returns Linear or radial gradient for ECharts.
 */
function createGradient(
  { angle, type }: { angle: number; type: GradientType },
  colorStops: ColorStops,
  shape: RadialShape = DEFAULT_RADIAL_SHAPE,
): LinearGradientObject | RadialGradientObject {
  if (type === 'radial') {
    return {
      colorStops,
      r: shape.radius,
      type: 'radial',
      x: shape.centerX,
      y: shape.centerY,
    }
  }
  return { ...getLinearGradientPoints(angle), colorStops, type: 'linear' }
}

// ===== FUNCTIONS =============================================================
/**
 * Resolves a paint with its own color into an ECharts color. Item styles
 * have no border opacity, so a border passes its opacity into the colors.
 * @param paint Paint of one chart element, e.g. gridlines or a bar border.
 * @param opacity Opacity folded into every color, 1 for none.
 * @returns A color or a gradient.
 */
export function createPaintColor(paint: Paint, opacity = 1): PaintColor {
  if (paint.kind === 'solid') {
    return color.modifyAlpha(resolveColor(paint.color), opacity)
  }
  return createGradient(
    paint,
    paint.stops.map((stop) => ({
      color: color.modifyAlpha(
        resolveColor(stop.color),
        stop.opacity * opacity,
      ),
      offset: stop.position,
    })),
    paint,
  )
}

/**
 * Resolves a paint in the series color into an ECharts color: the series
 * color itself or its fade. Without a series color, e.g. under a
 * continuous color scale, the visual map colors the marks and a fade
 * stays off.
 * @param paint Paint of a series fill or stroke.
 * @param seriesColor Resolved color of the series, if it has one.
 * @returns A color, a gradient, or undefined without a series color.
 */
export function createSeriesPaintColor(
  paint: SeriesPaint,
  seriesColor: string | undefined,
): PaintColor | undefined {
  if (!seriesColor || paint.kind === 'solid') {
    return seriesColor
  }
  return createGradient(paint, [
    { color: color.modifyAlpha(seriesColor, paint.startOpacity), offset: 0 },
    { color: color.modifyAlpha(seriesColor, paint.endOpacity), offset: 1 },
  ])
}
