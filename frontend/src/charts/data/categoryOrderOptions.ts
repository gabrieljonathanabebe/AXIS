import type { OptionItem } from '../../shared/ui/OptionsMenu'
import type { ChartLimit, ChartSort } from '../types'

// ===== TYPES =================================================================
/** Choice in the sort row, e.g. "value-desc" for Value ↓. */
export type SortChoice = `${ChartSort['by']}-${ChartSort['order']}`

/** Choice in the show row: all categories, or e.g. "top-5". */
export type LimitChoice = 'all' | `${ChartLimit['kind']}-${number}`

// ===== CONSTANTS =============================================================
export const SORT_OPTIONS: OptionItem<SortChoice>[] = [
  { label: 'Value ↓', value: 'value-desc' },
  { label: 'Value ↑', value: 'value-asc' },
  { label: 'A–Z', value: 'category-asc' },
  { label: 'Z–A', value: 'category-desc' },
]

/** Limits the show row offers; any other count still shows as its own. */
const LIMIT_PRESETS: ChartLimit[] = [
  { kind: 'top', count: 5 },
  { kind: 'top', count: 10 },
  { kind: 'bottom', count: 5 },
  { kind: 'bottom', count: 10 },
]

// ===== HELPERS ===============================================================
/**
 * Names a limit for the show row.
 * @param limit Top or bottom and the count.
 * @returns E.g. "Top 5" or "Bottom 10".
 */
function getLimitLabel({ count, kind }: ChartLimit): string {
  return `${kind === 'top' ? 'Top' : 'Bottom'} ${count}`
}

// ===== FUNCTIONS =============================================================
/** Choice of the sort row for a sort of the spec. */
export function toSortChoice({ by, order }: ChartSort): SortChoice {
  return `${by}-${order}`
}

/** Sort of the spec for a choice of the sort row. */
export function fromSortChoice(choice: SortChoice): ChartSort {
  const [by, order] = choice.split('-') as [ChartSort['by'], ChartSort['order']]
  return { by, order }
}

/** Choice of the show row for a limit of the spec; null shows all. */
export function toLimitChoice(limit: ChartLimit | null): LimitChoice {
  return limit ? `${limit.kind}-${limit.count}` : 'all'
}

/** Limit of the spec for a choice of the show row; all is null. */
export function fromLimitChoice(choice: LimitChoice): ChartLimit | null {
  if (choice === 'all') {
    return null
  }
  const [kind, count] = choice.split('-')
  return { kind: kind as ChartLimit['kind'], count: Number(count) }
}

/**
 * Options of the show row: all, the presets and, if the spec holds another
 * count, that limit too, so the select never shows a raw value.
 * @param limit Current limit of the chart.
 * @returns Options from all over the presets to a custom limit.
 */
export function getLimitOptions(
  limit: ChartLimit | null,
): OptionItem<LimitChoice>[] {
  const isPreset =
    !limit ||
    LIMIT_PRESETS.some((preset) => {
      return preset.kind === limit.kind && preset.count === limit.count
    })
  const limits = isPreset || !limit ? LIMIT_PRESETS : [...LIMIT_PRESETS, limit]
  return [
    { label: 'All', value: 'all' },
    ...limits.map((item) => ({
      label: getLimitLabel(item),
      value: toLimitChoice(item),
    })),
  ]
}
