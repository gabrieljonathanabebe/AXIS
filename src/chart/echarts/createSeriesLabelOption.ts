import type { LineSeriesOption } from 'echarts'
import type { LabelFontWeight, LabelsAppearance } from '../../types/chart'

// ===== TYPES =================================================================
type SeriesLabelOption = NonNullable<LineSeriesOption['label']>

// ===== CONSTANTS =============================================================
const labelFontWeights = {
  bold: 800,
  light: 200,
  medium: 500,
} satisfies Record<LabelFontWeight, number>

// ===== FUNCTION ==============================================================
export function createSeriesLabelOption(
  appearance: LabelsAppearance,
): SeriesLabelOption {
  return {
    color: appearance.color,
    fontSize: appearance.fontSize,
    fontWeight: labelFontWeights[appearance.fontWeight],
    position: appearance.position,
    show: appearance.enabled,
  }
}
