import { getColorCss } from './colorValue'

import type { CSSProperties } from 'react'
import type { ColorValue } from './colorValue'

// ===== TYPES =================================================================
/** Where a text or a group of items sits along its line. */
export type HorizontalAlignment = 'start' | 'center' | 'end'

/** Slant of a text; ECharts and CSS both know these values. */
export type FontStyle = 'normal' | 'italic'

export type FontWeight = 'light' | 'medium' | 'bold'

/** How a text looks; each text element on the canvas carries one. */
export type TextStyle = {
  color: ColorValue
  fontSize: number
  fontStyle: FontStyle
  fontWeight: FontWeight
}

// ===== CONSTANTS =============================================================
/** Numeric font weight of each step, shared by CSS and ECharts. */
export const FONT_WEIGHT_VALUES = {
  bold: 800,
  light: 200,
  medium: 500,
} satisfies Record<FontWeight, number>

// ===== FUNCTIONS =============================================================
/**
 * Turns a text style into CSS for texts rendered as HTML.
 * @param style Text style of one element, e.g. a title.
 * @returns Color, size, slant and numeric weight as inline style.
 */
export function getTextStyleCss(style: TextStyle): CSSProperties {
  return {
    color: getColorCss(style.color),
    fontSize: style.fontSize,
    fontStyle: style.fontStyle,
    fontWeight: FONT_WEIGHT_VALUES[style.fontWeight],
  }
}
