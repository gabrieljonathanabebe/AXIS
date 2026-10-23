import {
  createNumberFormatter,
  formatNumber,
  resolveNumberFormat,
} from '../../shared/format/formatNumber'
import { formatSelectionLabel } from '../../workspace/dataSelection'
import { hasAggregatedColor, isPointsChartType } from '../chartDefinitions'
import { HIGHLIGHT_SERIES_PREFIX } from './content/selectionStyle'
import { createAxisNumberFormatter } from './createAxisLabelFormatter'

import type { NumberFormatter } from '../../shared/format/formatNumber'
import type { DataSelection } from '../../workspace/types'
import type { ChartSpec, ChartType } from '../types'

type TooltipValue = string | number | null | undefined

type TooltipParam = {
  axisValue?: TooltipValue
  marker?: string
  name?: string
  seriesId?: string
  seriesName?: string
  value?: TooltipValue | TooltipValue[]
}

export type TooltipFormatter = (params: unknown) => string

function escapeHtml(value: TooltipValue): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatValue(
  value: TooltipValue,
  formatNumericValue: NumberFormatter,
): string {
  if (typeof value !== 'number') {
    return escapeHtml(value ?? 'No value')
  }
  return formatNumericValue(value)
}

/**
 * Formatter for the measure values in the tooltip; auto follows the Y axis,
 * e.g. a currency Y axis shows € in the tooltip.
 * @param spec Spec of the chart.
 * @returns Formatter of the tooltip values.
 */
function createValueFormatter(spec: ChartSpec): NumberFormatter {
  return createNumberFormatter(
    resolveNumberFormat(
      spec.interaction.tooltip.numberFormat,
      spec.appearance.yAxis.labels.numberFormat,
    ),
  )
}

function createRow(
  label: string,
  value: TooltipValue,
  marker = '',
  formatNumericValue: NumberFormatter = formatNumber,
): string {
  return [
    '<div class="chart-tooltip-row">',
    `<span>${marker}${escapeHtml(label)}</span>`,
    `<strong>${formatValue(value, formatNumericValue)}</strong>`,
    '</div>',
  ].join('')
}

function asParams(params: unknown): TooltipParam[] {
  if (Array.isArray(params)) {
    return params as TooltipParam[]
  }
  return [params as TooltipParam]
}

type CreateTooltipFormatterParams = {
  chartType: ChartType
  isSelectionSource: boolean
  selection: DataSelection | null
  spec: ChartSpec
  valueLabel: string | undefined
}

export function createTooltipFormatter({
  chartType,
  isSelectionSource,
  selection,
  spec,
  valueLabel,
}: CreateTooltipFormatterParams): TooltipFormatter {
  const { encoding } = spec.data
  const hasColorValue = hasAggregatedColor(chartType, encoding)
  const formatMeasureValue = createValueFormatter(spec)
  const formatXValue = createAxisNumberFormatter(spec.appearance.xAxis)
  return (params) => {
    const entries = asParams(params)
    const first = entries[0]
    if (!first) {
      return ''
    }
    if (isPointsChartType(chartType)) {
      const values = Array.isArray(first.value) ? first.value : []

      const fields = [
        [encoding.x, values[0], formatXValue],
        [encoding.y, values[1], formatMeasureValue],
        [encoding.size, values[2], formatNumber],
        [encoding.color, values[3], formatNumber],
      ] as const

      return fields
        .filter(([name]) => Boolean(name))
        .map(([name, value, formatFieldValue]) => {
          return createRow(name ?? '', value, '', formatFieldValue)
        })
        .join('')
    }

    const heading = first.axisValue ?? first.name ?? ''
    const rows = entries.flatMap((entry) => {
      const rawValue = entry.value
      const values = Array.isArray(rawValue) ? rawValue : null
      const value = Array.isArray(rawValue) ? rawValue[1] : rawValue
      const baseLabel = encoding.series
        ? entry.seriesName || valueLabel || 'Value'
        : valueLabel || 'Value'
      const selectionLabel = selection ? formatSelectionLabel(selection) : ''
      const isHighlight = Boolean(
        selection && entry.seriesId?.startsWith(HIGHLIGHT_SERIES_PREFIX),
      )
      if (isHighlight && isSelectionSource) {
        return []
      }
      const highlightLabel = encoding.series
        ? `${selectionLabel} · ${baseLabel}`
        : selectionLabel
      const label = isHighlight ? highlightLabel : baseLabel

      const valueRow = createRow(label, value, entry.marker, formatMeasureValue)

      if (!hasColorValue || !encoding.color || !values) {
        return [valueRow]
      }

      return [valueRow, createRow(encoding.color, values[2])]
    })

    return [
      `<div class="chart-tooltip-heading">${escapeHtml(heading)}</div>`,
      ...rows,
    ].join('')
  }
}
