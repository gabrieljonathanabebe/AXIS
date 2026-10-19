import type { GroupAggregation } from '../charts/types'
import type {
  ContainerFormatElement,
  DashboardObjectBase,
  ObjectTitleAppearance,
} from '../objects/types'
import type { CurrencyCode, ValueFormat } from '../shared/format/valueFormats'
import type { TextStyle } from '../shared/textStyle'

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
  selectionLabel: CardSelectionLabelAppearance
  title: ObjectTitleAppearance
  value: CardValueAppearance
}

/** Label below the value that names the selection it is filtered by. */
export type CardSelectionLabelAppearance = {
  textStyle: TextStyle
  visible: boolean
}

export type CardValueAppearance = {
  currency: CurrencyCode
  format: ValueFormat
  textStyle: TextStyle
}

// ===== FORMAT ================================================================
export type CardFormatElement =
  ContainerFormatElement | keyof CardAppearanceSpec
