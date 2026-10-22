import { getColorCss } from './colorValue'

import type { ColorValue } from './colorValue'
import type { CSSProperties } from 'react'

// ===== TYPES =================================================================
/** How a line is dashed; ECharts and CSS both know these values. */
export type LineStyle = 'solid' | 'dashed' | 'dotted'

/** How a line or outline looks, e.g. the border of a container. */
export type StrokeStyle = {
  color: ColorValue
  lineStyle: LineStyle
  opacity: number
  width: number
}

/** Stroke of a data series, e.g. a line; its color comes from the series. */
export type SeriesStrokeStyle = Omit<StrokeStyle, 'color'>

// ===== FUNCTIONS =============================================================
/**
 * Turns a stroke style into a CSS border for HTML elements.
 * @param style Stroke style, e.g. the border of a container.
 * @returns Color, style and width as border, the opacity as element opacity.
 */
export function getStrokeBorderCss(style: StrokeStyle): CSSProperties {
  return {
    borderColor: getColorCss(style.color),
    borderStyle: style.lineStyle,
    borderWidth: style.width,
    opacity: style.opacity,
  }
}

/**
 * Tells a stroke with its own color from a series stroke.
 * @param stroke Stroke style, e.g. of gridlines or a line mark.
 * @returns True when the stroke carries a color.
 */
export function hasStrokeColor(
  stroke: SeriesStrokeStyle,
): stroke is StrokeStyle {
  return 'color' in stroke
}
