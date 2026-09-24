import type { ChartSpec, ChartType } from '../../types/chart'

type TooltipValue = string | number | null | undefined

type TooltipParam = {
  axisValue?: TooltipValue
  marker?: string
  name?: string
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

function formatValue(value: TooltipValue): string {
  if (typeof value !== 'number') {
    return escapeHtml(value ?? 'No value')
  }
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(value)
}

function createRow(label: string, value: TooltipValue, marker = ''): string {
  return [
    '<div class="chart-tooltip-row">',
    `<span>${marker}${escapeHtml(label)}</span>`,
    `<strong>${formatValue(value)}</strong>`,
    '</div>',
  ].join('')
}

function asParams(params: unknown): TooltipParam[] {
  if (Array.isArray(params)) {
    return params as TooltipParam[]
  }
  return [params as TooltipParam]
}

export function createTooltipFormatter(
  chartType: ChartType,
  spec: ChartSpec,
): TooltipFormatter {
  const { encoding } = spec.data
  const hasBarColor = chartType === 'bar' && Boolean(encoding.color)
  return (params) => {
    const entries = asParams(params)
    const first = entries[0]
    if (!first) {
      return ''
    }
    if (chartType === 'scatter') {
      const values = Array.isArray(first.value) ? first.value : []

      const fields = [
        [encoding.x?.name, values[0]],
        [encoding.y?.name, values[1]],
        [encoding.size?.name, values[2]],
        [encoding.color?.name, values[3]],
      ] as const

      return fields
        .filter(([name]) => Boolean(name))
        .map(([name, value]) => {
          return createRow(name ?? '', value)
        })
        .join('')
    }

    const heading = first.axisValue ?? first.name ?? ''
    const rows = entries.flatMap((entry) => {
      const rawValue = entry.value
      const values = Array.isArray(rawValue) ? rawValue : null
      const value = Array.isArray(rawValue) ? rawValue[1] : rawValue
      const label = encoding.series
        ? entry.seriesName || encoding.y?.name || 'Value'
        : encoding.y?.name || 'Value'
      const valueRow = createRow(label, value, entry.marker)

      if (!hasBarColor || !encoding.color || !values) {
        return [valueRow]
      }

      return [valueRow, createRow(encoding.color.name, values[2])]
    })

    return [
      `<div class="chart-tooltip-heading">${escapeHtml(heading)}</div>`,
      ...rows,
    ].join('')
  }
}
