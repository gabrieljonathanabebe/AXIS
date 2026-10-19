import type { CSSProperties } from 'react'

// ===== TYPES =================================================================
/** How a line is dashed; ECharts and CSS both know these values. */
export type LineStyle = 'solid' | 'dashed' | 'dotted'

/** How a line or outline looks, e.g. the border of a container. */
export type StrokeStyle = {
  color: string
  lineStyle: LineStyle
  opacity: number
  width: number
}

// ===== FUNCTIONS =============================================================
/**
 * Turns a stroke style into a CSS border for HTML elements.
 * @param style Stroke style, e.g. the border of a container.
 * @returns Color, style and width as border, the opacity as element opacity.
 */
export function getStrokeBorderCss(style: StrokeStyle): CSSProperties {
  return {
    borderColor: style.color,
    borderStyle: style.lineStyle,
    borderWidth: style.width,
    opacity: style.opacity,
  }
}
