import { getColorCss } from './colorValue'

import type { ColorValue } from './colorValue'

// ===== TYPES =================================================================
/** Course of a gradient: along its angle, or from the center outward. */
export type GradientType = 'linear' | 'radial'

/** One color of a gradient; opacity and position run from 0 to 1. */
export type GradientStop = {
  color: ColorValue
  opacity: number
  position: number
}

/**
 * Color of an area or line with its own color: solid, or a gradient
 * between its stops. A linear gradient runs toward its angle in degrees, 0
 * to the right and counterclockwise like the rotation of axis labels; a
 * radial one ignores the angle and runs from the center to the edge.
 */
export type Paint =
  | { color: ColorValue; kind: 'solid' }
  | {
      angle: number
      kind: 'gradient'
      stops: GradientStop[]
      type: GradientType
    }

/**
 * Color of an area or line in the color of its series: solid, or a fade
 * of that color between two opacities, e.g. an area that fades out toward
 * the axis. Both opacities are relative to the opacity of the fill or
 * stroke.
 */
export type SeriesPaint =
  | { kind: 'solid' }
  | {
      angle: number
      endOpacity: number
      kind: 'fade'
      startOpacity: number
      type: GradientType
    }

/** Choice of the type buttons: one color, or a linear or radial gradient. */
export type PaintType = 'solid' | GradientType

// ===== CONSTANTS =============================================================
/** Angle a new gradient or fade starts with: downward, toward the axis. */
export const DEFAULT_GRADIENT_ANGLE = -90

// ===== FUNCTIONS =============================================================
/**
 * Tells a paint with its own color from a paint in the series color.
 * @param paint Paint of a fill or stroke.
 * @returns True when the paint carries its own colors.
 */
export function hasOwnColor(paint: Paint | SeriesPaint): paint is Paint {
  return paint.kind === 'gradient' || 'color' in paint
}

/**
 * Color that stands for a paint, e.g. the default swatch of a border.
 * @param paint Paint with its own color.
 * @returns The solid color or the color of the first stop.
 */
export function getPaintColor(paint: Paint): ColorValue {
  return paint.kind === 'solid' ? paint.color : paint.stops[0].color
}

/**
 * Type of a paint for the type buttons; a fade counts as its gradient type.
 * @param paint Paint with its own color or in the series color.
 * @returns Solid, linear or radial.
 */
export function getPaintType(paint: Paint | SeriesPaint): PaintType {
  return paint.kind === 'solid' ? 'solid' : paint.type
}

/**
 * Adds an opaque stop in the middle with the color of the last stop.
 * @param stops Stops of a gradient.
 * @returns The stops with the new one at the end.
 */
export function addGradientStop(stops: GradientStop[]): GradientStop[] {
  const lastStop = stops[stops.length - 1]
  return [...stops, { ...lastStop, opacity: 1, position: 0.5 }]
}

/**
 * Switches a paint with its own color to another type. A new gradient
 * runs opaque from the solid color to itself until an end color is
 * picked; back to solid keeps the first stop's color.
 * @param paint Current paint.
 * @param type Chosen type.
 * @returns The paint of the new type.
 */
export function changePaintType(paint: Paint, type: PaintType): Paint {
  if (type === 'solid') {
    return { color: getPaintColor(paint), kind: 'solid' }
  }
  if (paint.kind === 'gradient') {
    return { ...paint, type }
  }
  return {
    angle: DEFAULT_GRADIENT_ANGLE,
    kind: 'gradient',
    stops: [
      { color: paint.color, opacity: 1, position: 0 },
      { color: paint.color, opacity: 1, position: 1 },
    ],
    type,
  }
}

/**
 * Switches a paint in the series color to another type; a new fade runs
 * from full to no opacity.
 * @param paint Current paint.
 * @param type Chosen type.
 * @returns The paint of the new type.
 */
export function changeSeriesPaintType(
  paint: SeriesPaint,
  type: PaintType,
): SeriesPaint {
  if (type === 'solid') {
    return { kind: 'solid' }
  }
  if (paint.kind === 'fade') {
    return { ...paint, type }
  }
  return {
    angle: DEFAULT_GRADIENT_ANGLE,
    endOpacity: 0,
    kind: 'fade',
    startOpacity: 1,
    type,
  }
}

/**
 * Orders the stops of a gradient by position, since CSS and SVG draw a
 * stop that comes before the previous one at the previous position.
 * @param stops Stops in the order they were added.
 * @returns The stops from start to end.
 */
export function getSortedStops(stops: GradientStop[]): GradientStop[] {
  return [...stops].sort((first, second) => first.position - second.position)
}

/**
 * Turns the stops of a gradient into a CSS color stop list, e.g. for the
 * preview of a gradient field.
 * @param stops Stops of a gradient.
 * @returns Comma-separated color stops for a CSS gradient.
 */
export function getGradientStopsCss(stops: GradientStop[]): string {
  return getSortedStops(stops)
    .map((stop) => {
      return `${getColorCss(stop.color, stop.opacity)} ${stop.position * 100}%`
    })
    .join(', ')
}

/**
 * Turns a paint into a CSS background, e.g. of the canvas or a container.
 * A radial gradient reaches the edges from the center; a linear one turns
 * its angle into CSS, where 0 points up and angles run clockwise.
 * @param paint Paint with its own color.
 * @returns A CSS color or gradient.
 */
export function getPaintCss(paint: Paint): string {
  if (paint.kind === 'solid') {
    return getColorCss(paint.color)
  }
  const stops = getGradientStopsCss(paint.stops)
  return paint.type === 'radial'
    ? `radial-gradient(closest-side, ${stops})`
    : `linear-gradient(${90 - paint.angle}deg, ${stops})`
}

/**
 * Start and end of a linear gradient inside the bounds of a shape, from 0
 * to 1 on both axes with y downward, as ECharts and SVG take them. The
 * ends reach the corners, so every angle covers the whole shape.
 * @param angle Angle of the gradient, 0 to the right and counterclockwise.
 * @returns Start point x, y and end point x2, y2.
 */
export function getLinearGradientPoints(angle: number): {
  x: number
  x2: number
  y: number
  y2: number
} {
  const radians = (angle * Math.PI) / 180
  const dx = Math.cos(radians)
  const dy = -Math.sin(radians)
  const reach = (Math.abs(dx) + Math.abs(dy)) / 2
  return {
    x: 0.5 - dx * reach,
    x2: 0.5 + dx * reach,
    y: 0.5 - dy * reach,
    y2: 0.5 + dy * reach,
  }
}
