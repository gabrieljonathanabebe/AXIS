import type { LucideIcon } from 'lucide-react'

/** One choice of a select or segmented control; some controls show its icon. */
export type OptionItem<TValue extends string> = {
  disabled?: boolean
  icon?: LucideIcon
  label: string
  /** Shorter text for the select button, e.g. "Auto" for "Auto · Month". */
  shortLabel?: string
  value: TValue
}
