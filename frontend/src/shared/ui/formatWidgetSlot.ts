import { createContext } from 'react'

/**
 * Header of the format widget around a control, where the control can put
 * its own action, e.g. the gear of a paint; null outside a titled widget.
 */
export const FormatWidgetActionSlot = createContext<HTMLElement | null>(null)
