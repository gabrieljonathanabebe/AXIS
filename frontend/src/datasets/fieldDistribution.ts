import { formatDate } from '../shared/format/formatDate'
import { formatCompactNumber } from '../shared/format/formatNumber'

import type { FieldProfile } from './types'
import type { HistogramBar } from '../types/ui'

// ===== HELPERS ===============================================================
function createRangeBars(
  histogram: number[],
  min: number,
  max: number,
  formatValue: (value: number) => string,
): HistogramBar[] {
  const binWidth = (max - min) / histogram.length

  return histogram.map((count, index) => {
    const start = min + index * binWidth
    const end = start + binWidth
    return { count, label: `${formatValue(start)} – ${formatValue(end)}` }
  })
}

function formatTimestamp(value: number): string {
  return formatDate(new Date(value).toISOString())
}

// ===== FUNCTIONS =============================================================
export function createDistributionBars(
  field: FieldProfile,
  rowCount: number,
): HistogramBar[] {
  const { statistics } = field

  if (!statistics) {
    return []
  }

  switch (statistics.kind) {
    case 'measure': {
      const { histogram, max, min } = statistics
      if (min === null || max === null) {
        return []
      }
      return createRangeBars(histogram, min, max, formatCompactNumber)
    }
    case 'temporal': {
      const { histogram, max, min } = statistics
      if (!min || !max) {
        return []
      }
      return createRangeBars(
        histogram,
        Date.parse(min),
        Date.parse(max),
        formatTimestamp,
      )
    }
    case 'dimension': {
      const bars = statistics.value_counts.map(({ count, value }) => ({
        count,
        label: value,
      }))
      const topCount = bars.reduce((sum, bar) => sum + bar.count, 0)
      const otherCount = rowCount - field.missing_count - topCount
      return otherCount > 0
        ? [...bars, { count: otherCount, isMuted: true, label: 'Other' }]
        : bars
    }
  }
}
