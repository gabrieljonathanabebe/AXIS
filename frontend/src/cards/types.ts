import type {
  ChartTitleAppearance,
  GroupAggregation,
  LabelFontWeight,
} from '../charts/types'
import type { DashboardObjectBase } from '../objects/types'
import type { CurrencyCode, ValueFormat } from '../shared/format/valueFormats'

// ===== OBJECT ================================================================
export type CardInstance = DashboardObjectBase & {
  kind: 'card'
  spec: CardSpec
}

export type CardSpec = {
  data: CardDataSpec
  appearance: CardAppearanceSpec
}

// ===== DATA ==================================================================
/** What the card aggregates; without a field it counts the rows. */
export type CardDataSpec = {
  field: string | null
  aggregation: GroupAggregation
}

// ===== APPEARANCE ============================================================
/** Formatting per card element; a trend or histogram adds its own entry. */
export type CardAppearanceSpec = {
  title: ChartTitleAppearance
  value: CardValueAppearance
}

export type CardValueAppearance = {
  color: string
  currency: CurrencyCode
  fontSize: number
  fontWeight: LabelFontWeight
  format: ValueFormat
}

// ===== FORMAT ================================================================
export type CardFormatElement = keyof CardAppearanceSpec
