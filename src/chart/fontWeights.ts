import type { LabelFontWeight } from '../types/chart'

export const FONT_WEIGHT_VALUES = {
  bold: 800,
  light: 200,
  medium: 500,
} satisfies Record<LabelFontWeight, number>
