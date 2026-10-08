// ===== CONSTANTS =============================================================
const compactNumberFormat = new Intl.NumberFormat('en', {
  notation: 'compact',
})

const numberFormat = new Intl.NumberFormat('en', {
  maximumFractionDigits: 2,
})

const percentFormat = new Intl.NumberFormat('en', {
  maximumFractionDigits: 1,
  style: 'percent',
})

// ===== FUNCTIONS =============================================================
export function formatCompactNumber(value: number): string {
  return compactNumberFormat.format(value)
}

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

export function formatPercent(value: number): string {
  return percentFormat.format(value)
}
