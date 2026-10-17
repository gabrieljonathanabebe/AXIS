import type { LineSeriesOption } from 'echarts'

import { createTextStyleOption } from './createTextStyleOption'
import type { LabelsAppearance } from '../types'
import type { NumberFormatter } from '../../shared/format/formatNumber'

// ===== TYPES =================================================================
type SeriesLabelOption = NonNullable<LineSeriesOption['label']>

type LabelParams = {
  value?: unknown
}

// ===== HELPERS ===============================================================
// Data is either the value itself or a row like [category, value, color].
function getLabelValue(value: unknown): number | null {
  const labelValue = Array.isArray(value) ? value[1] : value
  return typeof labelValue === 'number' ? labelValue : null
}

// ===== FUNCTION ==============================================================
export function createSeriesLabelOption(
  appearance: LabelsAppearance,
  formatValue?: NumberFormatter,
): SeriesLabelOption {
  return {
    ...createTextStyleOption(appearance.textStyle),
    formatter: formatValue
      ? ({ value }: LabelParams) => {
          const labelValue = getLabelValue(value)
          return labelValue === null ? '' : formatValue(labelValue)
        }
      : undefined,
    position: appearance.position,
    show: appearance.visible,
  }
}
