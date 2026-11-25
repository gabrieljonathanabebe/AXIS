import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'

import type { HorizontalAlignment } from '@/shared/layout'
import type { OptionItem } from '@/shared/optionItem'

/** Start, center and end with their icons, e.g. for a title or legend. */
export const ALIGNMENT_OPTIONS = [
  { icon: AlignLeft, label: 'Start', value: 'start' },
  { icon: AlignCenter, label: 'Center', value: 'center' },
  { icon: AlignRight, label: 'End', value: 'end' },
] satisfies OptionItem<HorizontalAlignment>[]
