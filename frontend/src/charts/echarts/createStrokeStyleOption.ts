import type {
  LineStyle,
  SeriesStrokeStyle,
  StrokeStyle,
} from '../../shared/strokeStyle'

// ===== TYPES =================================================================
/** Line fields that gridlines and series lines share. */
type StrokeStyleOption = {
  color?: string
  opacity: number
  type: LineStyle
  width: number
}

// ===== FUNCTION ==============================================================
/**
 * Translates a stroke style of the spec into ECharts line fields.
 * @param style Stroke style of one chart element; a series stroke has no color.
 * @returns Color, opacity, dash type and width for ECharts.
 */
export function createStrokeStyleOption(
  style: SeriesStrokeStyle | StrokeStyle,
): StrokeStyleOption {
  return {
    color: 'color' in style ? style.color : undefined,
    opacity: style.opacity,
    type: style.lineStyle,
    width: style.width,
  }
}
