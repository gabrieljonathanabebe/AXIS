import type { LineSeriesOption } from 'echarts'

import { FONT_WEIGHT_VALUES } from '../fontWeights'
import type { LabelsAppearance } from '../../types/chart'

// ===== TYPES =================================================================
type SeriesLabelOption = NonNullable<LineSeriesOption['label']>

// ===== FUNCTION ==============================================================
export function createSeriesLabelOption(
  appearance: LabelsAppearance,
): SeriesLabelOption {
  return {
    color: appearance.color,
    fontSize: appearance.fontSize,
    fontWeight: FONT_WEIGHT_VALUES[appearance.fontWeight],
    position: appearance.position,
    show: appearance.enabled,
  }
}
