import { hasAggregatedColor } from './chartDefinitions'
import { getColorEncodingMode } from './getColorEncodingMode'
import { getNumericDomain } from './getNumericDomain'

import type { DataRow, Dataset } from '../datasets/types'
import type { ChartQueryResult } from './chartsApi'
import type { NumericDomain } from './getNumericDomain'
import type { ChartSpec, ChartType } from './types'

// ===== TYPES =================================================================
type ColorScaleRangeParams = {
  chartType: ChartType
  dataset: Dataset
  points: DataRow[]
  queryResult: ChartQueryResult | null
  spec: ChartSpec
}

// ===== HELPERS ===============================================================
/**
 * Values a continuous color field gives the marks: one per point of a
 * scatter, one per bar or line point of an aggregated chart.
 * @param params Chart type, fields, rows and results of the chart.
 * @returns The values, or null when no continuous field colors the marks.
 */
function getColorValues({
  chartType,
  dataset,
  points,
  queryResult,
  spec,
}: ColorScaleRangeParams): unknown[] | null {
  const { encoding } = spec.data
  const colorFieldName = encoding.color
  const mode = getColorEncodingMode(chartType, encoding, dataset.fields)
  if (!colorFieldName || mode !== 'continuous') {
    return null
  }
  if (hasAggregatedColor(chartType, encoding)) {
    return (queryResult?.points ?? []).map((point) => point.color_value)
  }
  return chartType === 'scatter'
    ? points.map((row) => row[colorFieldName])
    : null
}

// ===== FUNCTION ==============================================================
/**
 * Range of the continuous color scale: the set minimum and maximum, else
 * those of the color values. The adapter colors the marks by it and the
 * HTML scale labels its ends with it, so both always agree.
 * @param params Chart type, fields, rows and results of the chart.
 * @returns Minimum and maximum, or null without a continuous color field
 *   or without numeric values.
 */
export function getColorScaleRange(
  params: ColorScaleRangeParams,
): NumericDomain | null {
  const values = getColorValues(params)
  const domain = values ? getNumericDomain(values) : null
  if (!domain) {
    return null
  }
  const { max, min } = params.spec.appearance.colorScale.continuous
  const start = min ?? domain.min
  const end = max ?? domain.max
  return { max: end <= start ? start + 1 : end, min: start }
}
