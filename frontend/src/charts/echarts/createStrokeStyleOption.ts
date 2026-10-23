import { color } from 'echarts'

import { resolveColor } from './resolveColor'

import type {
  LineStyle,
  SeriesStrokeStyle,
  StrokeStyle,
} from '../../shared/strokeStyle'
import type { ChartTheme } from './chartTheme'

// ===== TYPES =================================================================
/** Border fields of ECharts in the item style of a filled mark. */
type BorderOption = {
  borderColor: string
  borderType: LineStyle
  borderWidth: number
}

/** Line fields that gridlines and series lines share. */
type StrokeStyleOption = {
  color?: string
  opacity: number
  type: LineStyle
  width: number
}

// ===== FUNCTIONS =============================================================
/**
 * Translates a border of the spec into ECharts item style fields. Item
 * styles have no border opacity, so the opacity goes into the color.
 * @param border Border of one mark, e.g. of a bar or a pie segment.
 * @param theme Chart theme that resolves a token color.
 * @returns Color with opacity, dash type and width of the border.
 */
export function createBorderOption(
  border: StrokeStyle,
  theme: ChartTheme,
): BorderOption {
  return {
    borderColor: color.modifyAlpha(
      resolveColor(border.color, theme),
      border.opacity,
    ),
    borderType: border.lineStyle,
    borderWidth: border.width,
  }
}

/**
 * Translates a stroke style of the spec into ECharts line fields.
 * @param style Stroke style of one chart element; a series stroke has no color.
 * @param theme Chart theme that resolves a token color.
 * @returns Color, opacity, dash type and width for ECharts.
 */
export function createStrokeStyleOption(
  style: SeriesStrokeStyle | StrokeStyle,
  theme: ChartTheme,
): StrokeStyleOption {
  return {
    color: 'color' in style ? resolveColor(style.color, theme) : undefined,
    opacity: style.opacity,
    type: style.lineStyle,
    width: style.width,
  }
}
