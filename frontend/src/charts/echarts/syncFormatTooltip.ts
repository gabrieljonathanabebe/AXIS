import type { ECharts } from 'echarts'
import type { ChartFormatElement } from '../types'

// ===== TYPES =================================================================
/** Where the preview tooltip opens: one data item of one series. */
type PreviewPoint = {
  dataIndex: number
  seriesIndex: number
}

// ===== HELPERS ===============================================================
/**
 * Reads the number of one data item, whatever shape its series uses.
 * @param item A number, an [x, y] pair or an object with a value.
 * @returns The value, for pairs the y value; null when there is none.
 */
function getItemValue(item: unknown): number | null {
  if (typeof item === 'number') {
    return item
  }
  if (Array.isArray(item)) {
    return getItemValue(item[1])
  }
  if (typeof item === 'object' && item !== null && 'value' in item) {
    return getItemValue(item.value)
  }
  return null
}

/**
 * Finds the item with the largest value, a prominent point that every
 * chart with data has.
 * @param series Series of the rendered option.
 * @returns Series and data index, or null when no item has a value.
 */
function findPreviewPoint(series: { data?: unknown[] }[]): PreviewPoint | null {
  let point: PreviewPoint | null = null
  let largest = Number.NEGATIVE_INFINITY
  for (const [seriesIndex, { data = [] }] of series.entries()) {
    for (const [dataIndex, item] of data.entries()) {
      const value = getItemValue(item)
      if (value !== null && value > largest) {
        largest = value
        point = { dataIndex, seriesIndex }
      }
    }
  }
  return point
}

// ===== FUNCTION ==============================================================
/**
 * Keeps the data tooltip out of format mode; the label at the pointer tells
 * what a click formats instead. While the tooltip itself is formatted, it
 * stays open at the largest value as a live preview and ignores the pointer.
 * Editor state like `syncFormatFocus`, gone with the next full `setOption`.
 * @param instance ECharts instance of the chart.
 * @param formattedElement Element in the popover, or null when it is closed.
 * @param isTooltipEnabled Whether the chart shows a tooltip at all.
 */
export function syncFormatTooltip(
  instance: ECharts,
  formattedElement: ChartFormatElement | null,
  isTooltipEnabled: boolean,
): void {
  if (!formattedElement) {
    return
  }
  const { series = [] } = instance.getOption() as {
    series?: { data?: unknown[] }[]
  }
  const point =
    formattedElement === 'tooltip' && isTooltipEnabled
      ? findPreviewPoint(series)
      : null
  if (!point) {
    instance.dispatchAction({ type: 'hideTip' })
    instance.setOption({ tooltip: { show: false } })
    return
  }
  instance.setOption({
    tooltip: { alwaysShowContent: true, triggerOn: 'none' },
  })
  instance.dispatchAction({ type: 'showTip', ...point })
}
