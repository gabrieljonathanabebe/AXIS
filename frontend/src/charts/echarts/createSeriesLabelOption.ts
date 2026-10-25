import {
  createNumberFormatter,
  resolveNumberFormat,
} from '../../shared/format/formatNumber'
import { createTextStyleOption } from './createTextStyleOption'

import type { LineSeriesOption } from 'echarts'
import type { NumberFormatter } from '../../shared/format/formatNumber'
import type { ChartAppearanceSpec, LabelsAppearance } from '../types'
import type { ChartTheme } from './chartTheme'

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
/**
 * Creates the data labels of a series.
 * @param appearance Appearance of the data labels.
 * @param theme Chart theme that resolves the label color.
 * @param formatValue Formatter for the label values; without it ECharts
 * shows its default label.
 * @returns Label option of the series.
 */
export function createSeriesLabelOption(
  appearance: LabelsAppearance,
  theme: ChartTheme,
  formatValue?: NumberFormatter,
): SeriesLabelOption {
  return {
    ...createTextStyleOption(appearance.textStyle, theme),
    formatter: formatValue
      ? ({ value }: LabelParams) => {
          const labelValue = getLabelValue(value)
          return labelValue === null ? '' : formatValue(labelValue)
        }
      : undefined,
    position: appearance.layout.position,
    show: appearance.visible,
  }
}

/**
 * Number formatter of the data labels; auto follows the Y axis.
 * @param appearance Appearance of the chart.
 * @returns Formatter for the label values.
 */
export function createLabelNumberFormatter(
  appearance: ChartAppearanceSpec,
): NumberFormatter {
  return createNumberFormatter(
    resolveNumberFormat(
      appearance.labels.numberFormat,
      appearance.yAxis.labels.numberFormat,
    ),
  )
}
