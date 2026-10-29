import { use } from 'react'
import { createPortal } from 'react-dom'

import { FormatWidgetActionSlot } from './formatWidgetSlot'

import type { ReactNode } from 'react'

// ===== TYPES =================================================================
type FormatWidgetActionProps = {
  children: ReactNode
}

// ===== COMPONENT =============================================================
/**
 * Moves an action of a control into the header of its format widget, right
 * of eye and plus, e.g. the gear of a paint. Outside a titled widget, e.g.
 * in the build panel, it stays where the control renders it.
 * @param props The action, e.g. a `DetailsPopover`.
 */
function FormatWidgetAction({ children }: FormatWidgetActionProps) {
  const slot = use(FormatWidgetActionSlot)
  return slot ? createPortal(children, slot) : children
}

export default FormatWidgetAction
