import { FONT_WEIGHT_VALUES } from '../../shared/textStyle'
import { resolveColor } from './resolveColor'

import type { ChartTheme } from './chartTheme'
import type { FontStyle, TextStyle } from '../../shared/textStyle'

// ===== TYPES =================================================================
/** Text fields that axis names and labels, legend and series labels share. */
type TextStyleOption = {
  color: string
  fontSize: number
  fontStyle: FontStyle
  fontWeight: number
}

// ===== FUNCTION ==============================================================
/**
/**
 * Translates a text style of the spec into ECharts text fields.
 * @param style Text style of one chart element.
 * @param theme Chart theme that resolves a token color.
 * @returns Color, size, slant and numeric weight for ECharts.
 */
export function createTextStyleOption(
  style: TextStyle,
  theme: ChartTheme,
): TextStyleOption {
  return {
    color: resolveColor(style.color, theme),
    fontSize: style.fontSize,
    fontStyle: style.fontStyle,
    fontWeight: FONT_WEIGHT_VALUES[style.fontWeight],
  }
}
